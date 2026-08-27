package com.government.infosys.repository;

import com.government.infosys.entity.SanctionOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SanctionOrderRepository
        extends JpaRepository<SanctionOrder, Long> {

    Optional<SanctionOrder> findBySanctionOrderNumber(
            String sanctionOrderNumber
    );

    List<SanctionOrder> findByApplicationId(Long applicationId);

    List<SanctionOrder> findByIssuedByUserId(Long userId);

    List<SanctionOrder> findByStatus(String status);
}   