package com.government.infosys.service;

import com.government.infosys.entity.Application;
import com.government.infosys.entity.Status;
import com.government.infosys.repository.ApplicationRepository;
import com.government.infosys.repository.StatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private StatusRepository statusRepository;

    /**
     * Submit a new application.
     */
    public Application submitApplication(Application application) {

        if (application.getSubmittedAt() == null) {
            application.setSubmittedAt(LocalDateTime.now());
        }

        if (application.getCurrentStatus() == null) {
            Status pendingStatus = statusRepository.findByCode("PENDING")
                    .orElseThrow(() ->
                            new RuntimeException("PENDING application status not found"));

            application.setCurrentStatus(pendingStatus);
        }

        return applicationRepository.save(application);
    }

    /**
     * Fetch all applications for a given Aadhaar number.
     * Returns all applications if Aadhaar is null/empty.
     */
    public List<Application> getApplicationsByAadhar(String aadhar) {

        if (aadhar == null || aadhar.isBlank()) {
            return applicationRepository.findAll();
        }

        return applicationRepository.findByApplicantAadhar(aadhar);
    }

    /**
     * Update application status.
     */
    public Application updateStatus(Long id, String statusCode) {

        Application app = applicationRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Application not found: " + id));

        String code = statusCode != null
                ? statusCode.toUpperCase()
                : "PENDING";

        Status status = statusRepository.findByCode(code)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Application status not found: " + code
                        ));

        app.setCurrentStatus(status);

        return applicationRepository.save(app);
    }

    /**
     * Get a single application by ID.
     */
    public Application getById(Long id) {

        return applicationRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Application not found: " + id));
    }
}