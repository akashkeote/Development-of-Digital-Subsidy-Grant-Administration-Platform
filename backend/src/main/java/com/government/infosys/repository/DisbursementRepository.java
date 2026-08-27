package com.government.infosys.repository;

import com.government.infosys.entity.Disbursement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DisbursementRepository
        extends JpaRepository<Disbursement, Long> {

    Optional<Disbursement> findByTransactionReference(
            String transactionReference
    );

    List<Disbursement> findByApplicationId(Long applicationId);

    List<Disbursement> findBySanctionOrderId(Long sanctionOrderId);

    List<Disbursement> findByReleasedByUserId(Long userId);

    List<Disbursement> findByPaymentStatus(String paymentStatus);
}