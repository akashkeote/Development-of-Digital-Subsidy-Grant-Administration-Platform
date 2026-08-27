package com.government.infosys.service;

import com.government.infosys.entity.Application;
import com.government.infosys.entity.FieldVerification;
import com.government.infosys.repository.ApplicationJpaRepository;
import com.government.infosys.repository.FieldVerificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FieldVerificationService {

    @Autowired
    private FieldVerificationRepository fieldVerificationRepository;

    @Autowired
    private ApplicationJpaRepository applicationRepository;

    /**
     * Create a new field verification record.
     */
    public FieldVerification createVerification(
            Long applicationId,
            Long verifierUserId,
            String verificationStatus,
            String remarks) {

        Application application = applicationRepository
                .findById(applicationId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Application not found: " + applicationId
                        )
                );

        FieldVerification verification =
                FieldVerification.builder()
                        .application(application)
                        .verifierUserId(verifierUserId)
                        .verificationStatus(verificationStatus)
                        .remarks(remarks)
                        .verifiedAt(LocalDateTime.now())
                        .build();

        return fieldVerificationRepository.save(verification);
    }

    /**
     * Get all verification records for an application.
     */
    public List<FieldVerification> getByApplicationId(
            Long applicationId) {

        return fieldVerificationRepository
                .findByApplicationId(applicationId);
    }

    /**
     * Get all verifications assigned to a verifier.
     */
    public List<FieldVerification> getByVerifierUserId(
            Long verifierUserId) {

        return fieldVerificationRepository
                .findByVerifierUserId(verifierUserId);
    }

    /**
     * Get all verification records.
     */
    public List<FieldVerification> getAll() {

        return fieldVerificationRepository.findAll();
    }
}