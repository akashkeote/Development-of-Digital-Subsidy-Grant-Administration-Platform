package com.government.infosys.service;

import com.government.infosys.entity.Application;
import com.government.infosys.entity.FinanceApproval;
import com.government.infosys.repository.ApplicationJpaRepository;
import com.government.infosys.repository.FinanceApprovalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class FinanceApprovalService {

    @Autowired
    private FinanceApprovalRepository financeApprovalRepository;

    @Autowired
    private ApplicationJpaRepository applicationRepository;


    /**
     * Create a finance approval record for an application.
     */
    public FinanceApproval createApproval(
            Long applicationId,
            Long approvedByUserId,
            String approvalStatus,
            BigDecimal approvedAmount,
            String remarks) {

        Application application = applicationRepository
                .findById(applicationId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Application not found: " + applicationId
                        )
                );

        FinanceApproval financeApproval =
                FinanceApproval.builder()
                        .application(application)
                        .approvedByUserId(approvedByUserId)
                        .approvalStatus(approvalStatus)
                        .approvedAmount(approvedAmount)
                        .remarks(remarks)
                        .approvedAt(LocalDateTime.now())
                        .build();

        return financeApprovalRepository.save(financeApproval);
    }


    /**
     * Get all finance approvals for a specific application.
     */
    public List<FinanceApproval> getByApplicationId(
            Long applicationId) {

        return financeApprovalRepository
                .findByApplicationId(applicationId);
    }


    /**
     * Get all approvals made by a particular finance officer.
     */
    public List<FinanceApproval> getByApprovedByUserId(
            Long userId) {

        return financeApprovalRepository
                .findByApprovedByUserId(userId);
    }


    /**
     * Get finance approvals by status.
     * Example: APPROVED / REJECTED / PENDING
     */
    public List<FinanceApproval> getByApprovalStatus(
            String approvalStatus) {

        return financeApprovalRepository
                .findByApprovalStatus(approvalStatus);
    }


    /**
     * Get all finance approval records.
     */
    public List<FinanceApproval> getAll() {

        return financeApprovalRepository.findAll();
    }
}