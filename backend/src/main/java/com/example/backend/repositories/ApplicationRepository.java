package com.example.backend.repositories;

import com.example.backend.models.Application;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Enterprise dual-write Application Repository:
 *
 *   PRIMARY   → Supabase PostgreSQL (via JPA)  — persistent, queryable
 *   SECONDARY → Firebase Firestore              — real-time Flutter updates
 *
 * NOTE: Schemes are NOT in this repo. They live in SubsidyRepository (local JSON).
 * This repo handles ONLY user Applications, so quota usage is minimal.
 */
@Service
public class ApplicationRepository {

    @Autowired
    private ApplicationJpaRepository jpaRepo;

    /**
     * Save application to Supabase (primary) and mirror to Firebase (secondary).
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

        // 2. SECONDARY: Mirror to Firebase Firestore for real-time Flutter updates
        try {
            FirestoreClient.getFirestore()
                .collection("applications")
                .document(saved.getId())
                .set(saved);
            System.out.println("[Firebase] Application mirrored: " + saved.getId());
        } catch (Exception e) {
            // Firebase is non-critical — Supabase is the source of truth
            System.err.println("[Firebase] Mirror failed (non-fatal): " + e.getMessage());
        }

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

            // Sync status to Firebase too
            try {
                FirestoreClient.getFirestore()
                    .collection("applications")
                    .document(id)
                    .update("status", newStatus);
            } catch (Exception e) {
                System.err.println("[Firebase] Status sync failed: " + e.getMessage());
            }

            return updated;
        }).orElseThrow(() -> new RuntimeException("Application not found: " + id));
    }
}
