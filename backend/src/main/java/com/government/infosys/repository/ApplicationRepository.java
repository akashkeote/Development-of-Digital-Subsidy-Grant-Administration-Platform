package com.government.infosys.repository;

import com.government.infosys.entity.Application;
import com.government.infosys.entity.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Application Repository Service.
 *
 * Uses ApplicationJpaRepository for persistent database operations.
 */
@Service
public class ApplicationRepository {

    @Autowired
    private ApplicationJpaRepository jpaRepo;

    /**
     * Save application to the database.
     */
    public Application save(Application application) {

        if (application.getSubmittedAt() == null) {
            application.setSubmittedAt(LocalDateTime.now());
        }

        return jpaRepo.save(application);
    }

    /**
     * Fetch all applications.
     */
    public List<Application> findAll() {
        return jpaRepo.findAll();
    }

    /**
     * Find application by database ID.
     */
    public Optional<Application> findById(Long id) {
        return jpaRepo.findById(id);
    }

    /**
     * Find applications belonging to a citizen using Aadhaar number.
     */
    public List<Application> findByApplicantAadhar(String aadhar) {

        return jpaRepo.findByCitizen_User_AadharNumber(aadhar)
                .map(List::of)
                .orElse(List.of());
    }

    /**
     * Find all applications for a scheme.
     */
    public List<Application> findBySchemeId(Long schemeId) {
        return jpaRepo.findBySchemeId(schemeId);
    }

    /**
     * Update application status.
     */
    public Application updateStatus(Long id, Status newStatus) {

        return jpaRepo.findById(id)
                .map(application -> {

                    application.setCurrentStatus(newStatus);

                    return jpaRepo.save(application);
                })
                .orElseThrow(() ->
                        new RuntimeException("Application not found: " + id));
    }
}