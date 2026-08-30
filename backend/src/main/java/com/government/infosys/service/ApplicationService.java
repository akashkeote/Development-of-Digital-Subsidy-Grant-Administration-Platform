package com.government.infosys.service;

import com.government.infosys.entity.Application;
import com.government.infosys.entity.CitizenProfile;
import com.government.infosys.entity.Scheme;
import com.government.infosys.entity.Status;
import com.government.infosys.repository.ApplicationRepository;
import com.government.infosys.repository.CitizenProfileRepository;
import com.government.infosys.repository.SchemeRepository;
import com.government.infosys.repository.StatusRepository;
import com.government.infosys.dto.CreateApplicationRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private CitizenProfileRepository citizenProfileRepository;

    @Autowired
    private SchemeRepository schemeRepository;

    @Autowired
    private StatusRepository statusRepository;

    /**
     * Submit a new application.
     *
     * Responsibilities:
     * 1. Validate citizen
     * 2. Validate scheme
     * 3. Set application number
     * 4. Set submission time
     * 5. Set initial application status
     * 6. Set initial approval status
     * 7. Save application
     */
    @Transactional
    public Application submitApplication(
            CreateApplicationRequest request) {

        if (request == null) {
            throw new IllegalArgumentException(
                    "Application request cannot be null"
            );
        }


        /*
         * Find citizen.
         */
        CitizenProfile citizen =
                citizenProfileRepository.findById(
                        request.getCitizenId()
                ).orElseThrow(() ->
                        new IllegalArgumentException(
                                "Citizen not found: "
                                        + request.getCitizenId()
                        )
                );

        /*
         * Find scheme.
         */
        Scheme scheme =
                schemeRepository.findById(
                        request.getSchemeId()
                ).orElseThrow(() ->
                        new IllegalArgumentException(
                                "Scheme not found: "
                                        + request.getSchemeId()
                        )
                );

        /*
         * Check scheme status.
         */
        if (Boolean.FALSE.equals(scheme.getIsActive())) {

            throw new IllegalStateException(
                    "Cannot apply for inactive scheme: "
                            + scheme.getName()
            );
        }

        /*
         * Initial application status.
         *
         * APPLICATION status type:
         * SUBMITTED = newly submitted application.
         */
        Status submittedStatus =
                statusRepository
                        .findStatus(
                                "SUBMITTED",
                                "APPLICATION"
                        )
                        .orElseThrow(() ->
                                new IllegalStateException(
                                        "SUBMITTED application status not found"
                                ));

        /*
         * Initial approval decision status.
         *
         * APPROVAL status type:
         * PENDING = waiting for approval decision.
         */
        Status approvalPendingStatus =
                statusRepository
                        .findStatus(
                                "PENDING",
                                "APPROVAL"
                        )
                        .orElseThrow(() ->
                                new IllegalStateException(
                                        "PENDING approval status not found"
                                ));

        /*
         * Create application.
         */
        Application application =
                Application.builder()
                        .applicationNo(generateApplicationNumber())
                        .citizen(citizen)
                        .scheme(scheme)
                        .currentStatus(submittedStatus)
                        .approvalStatus(approvalPendingStatus)
                        .priority(request.getPriority())
                        .remarks(request.getRemarks())
                        .submittedAt(LocalDateTime.now())
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build();
        /*
         * Save.
         */
        Application saved =
                applicationRepository.save(application);

        System.out.println(
                "Application submitted: "
                        + saved.getApplicationNo()
        );

        return saved;
    }

    /**
     * Generate a unique application number.
     *
     * Example:
     * APP-20260830-153045-123
     */
    private String generateApplicationNumber() {

        String timestamp =
                LocalDateTime.now()
                        .format(
                                DateTimeFormatter.ofPattern(
                                        "yyyyMMdd-HHmmss-SSS"
                                )
                        );

        return "APP-" + timestamp;
    }

    /**
     * Fetch all applications for a given Aadhaar number.
     *
     * Returns all applications if Aadhaar is null/empty.
     */
    public List<Application> getApplicationsByAadhar(
            String aadhar) {

        if (aadhar == null || aadhar.isBlank()) {
            return applicationRepository.findAll();
        }

        return applicationRepository.findByApplicantAadhar(aadhar);
    }

    /**
     * Update application status.
     */
    @Transactional
    public Application updateStatus(
            Long id,
            String statusCode) {

        Application app =
                applicationRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found: " + id
                                )
                        );

        if (statusCode == null
                || statusCode.isBlank()) {

            throw new IllegalArgumentException(
                    "Status code is required"
            );
        }

        String code =
                statusCode.trim().toUpperCase();

        Status status =
                statusRepository.findByCode(code)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application status not found: "
                                                + code
                                )
                        );

        app.setCurrentStatus(status);

        return applicationRepository.save(app);
    }

    /**
     * Get a single application by ID.
     */
    @Transactional(readOnly = true)
    public Application getById(Long id) {

        return applicationRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Application not found: " + id
                        )
                );
    }
}