package com.government.infosys.service;

import com.government.infosys.entity.Application;
import com.government.infosys.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    /**
     * Submit a new application.
     * Generates a UUID, sets status to PENDING, and records the timestamp.
     */
    public Application submitApplication(Application application) {
        application.setId(UUID.randomUUID().toString());
        application.setStatus("PENDING");
        application.setSubmittedAt(
            LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
        );
        return applicationRepository.save(application);
    }

    /**
     * Fetch all applications for a given Aadhar number.
     * Returns all if aadhar is null/empty (admin use).
     */
    public List<Application> getApplicationsByAadhar(String aadhar) {
        if (aadhar == null || aadhar.isBlank()) {
            return applicationRepository.findAll();
        }
        return applicationRepository.findByApplicantAadhar(aadhar);
    }

    /**
     * Update the status of an application.
     * Valid statuses: PENDING, UNDER_REVIEW, APPROVED, REJECTED
     */
    public Application updateStatus(String id, String status) {
        Application app = applicationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Application not found: " + id));
        app.setStatus(status != null ? status.toUpperCase() : "PENDING");
        return applicationRepository.save(app);
    }

    /**
     * Get a single application by ID.
     */
    public Application getById(String id) {
        return applicationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Application not found: " + id));
    }
}
