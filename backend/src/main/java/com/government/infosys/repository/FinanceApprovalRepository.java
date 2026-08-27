package com.government.infosys.repository;

import com.government.infosys.entity.FinanceApproval;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FinanceApprovalRepository
        extends JpaRepository<FinanceApproval, Long> {

    List<FinanceApproval> findByApplicationId(Long applicationId);

    List<FinanceApproval> findByApprovedByUserId(Long userId);

    List<FinanceApproval> findByApprovalStatus(String approvalStatus);
} 