package com.government.infosys.repository;

import com.government.infosys.entity.FieldVerification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FieldVerificationRepository
        extends JpaRepository<FieldVerification, Long> {

    List<FieldVerification> findByApplicationId(Long applicationId);

    List<FieldVerification> findByVerifierUserId(Long verifierUserId);

    List<FieldVerification> findByVerificationStatus(String verificationStatus);
}