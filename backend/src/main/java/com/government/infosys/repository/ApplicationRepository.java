package com.government.infosys.repository;

import com.government.infosys.entity.Application;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Enterprise Application Repository:
 *
 *   PRIMARY   → Supabase PostgreSQL (via JPA)  — persistent, queryable
 *
 * NOTE: Schemes are NOT in this repo. They live in SubsidyRepository (local JSON).
 */
@Service
public class ApplicationRepository {

    @Autowired
    private ApplicationJpaRepository jpaRepo;

    /**
     * Save application to Supabase (primary).
     */
    public Application save(Application application) {
        // Assign ID + defaults
        if (application.getId() == null || application.getId().isEmpty()) {
            application.setId(UUID.randomUUID().toString());
        }
        if (application.getStatus() == null) {
            application.setStatus("PENDING");
        }
        if (application.getSubmittedAt() == null) {
            application.setSubmittedAt(Instant.now().toString());
        }

        // 1. PRIMARY: Save to Supabase (PostgreSQL)
        Application saved = jpaRepo.save(application);
        System.out.println("[Supabase] Application saved: " + saved.getId());

        return saved;
    }

    /**
     * Fetch all from Supabase.
     */
    public List<Application> findAll() {
        return jpaRepo.findAll();
    }

    /**
     * Find by ID from Supabase.
     */
    public java.util.Optional<Application> findById(String id) {
        return jpaRepo.findById(id);
    }

    /**
     * Find by Aadhaar number (user's application history).
     */
    public List<Application> findByApplicantAadhar(String aadhar) {
        return jpaRepo.findByApplicantAadhar(aadhar);
    }

    /**
     * Find all applications for a scheme.
     */
    public List<Application> findBySchemeId(String schemeId) {
        return jpaRepo.findBySchemeId(schemeId);
    }

    /**
     * Update application status (admin action).
     */
    public Application updateStatus(String id, String newStatus) {
        return jpaRepo.findById(id).map(app -> {
            app.setStatus(newStatus);
            Application updated = jpaRepo.save(app);

            return updated;
        }).orElseThrow(() -> new RuntimeException("Application not found: " + id));
    }
}
