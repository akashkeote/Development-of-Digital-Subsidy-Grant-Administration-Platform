package com.government.infosys.service;

import com.government.infosys.entity.Application;
import com.government.infosys.entity.SanctionOrder;
import com.government.infosys.repository.ApplicationJpaRepository;
import com.government.infosys.repository.SanctionOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class SanctionOrderService {

    @Autowired
    private SanctionOrderRepository sanctionOrderRepository;

    @Autowired
    private ApplicationJpaRepository applicationRepository;


    /**
     * Create a sanction order for an approved application.
     */
    public SanctionOrder createSanctionOrder(
            Long applicationId,
            String sanctionOrderNumber,
            BigDecimal sanctionedAmount,
            Long issuedByUserId,
            String status,
            String remarks) {

        Application application = applicationRepository
                .findById(applicationId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Application not found: " + applicationId
                        )
                );

        if (sanctionOrderRepository
                .findBySanctionOrderNumber(sanctionOrderNumber)
                .isPresent()) {

            throw new RuntimeException(
                    "Sanction order number already exists: "
                            + sanctionOrderNumber
            );
        }

        SanctionOrder sanctionOrder =
                SanctionOrder.builder()
                        .application(application)
                        .sanctionOrderNumber(sanctionOrderNumber)
                        .sanctionedAmount(sanctionedAmount)
                        .issuedByUserId(issuedByUserId)
                        .status(status)
                        .remarks(remarks)
                        .issuedAt(LocalDateTime.now())
                        .build();

        return sanctionOrderRepository.save(sanctionOrder);
    }


    /**
     * Get a sanction order using its ID.
     */
    public SanctionOrder getById(Long id) {

        return sanctionOrderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Sanction order not found: " + id
                        )
                );
    }


    /**
     * Get a sanction order using its order number.
     */
    public SanctionOrder getByOrderNumber(
            String sanctionOrderNumber) {

        return sanctionOrderRepository
                .findBySanctionOrderNumber(sanctionOrderNumber)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Sanction order not found: "
                                        + sanctionOrderNumber
                        )
                );
    }


    /**
     * Get all sanction orders for an application.
     */
    public List<SanctionOrder> getByApplicationId(
            Long applicationId) {

        return sanctionOrderRepository
                .findByApplicationId(applicationId);
    }


    /**
     * Get sanction orders issued by a specific user.
     */
    public List<SanctionOrder> getByIssuedByUserId(
            Long userId) {

        return sanctionOrderRepository
                .findByIssuedByUserId(userId);
    }


    /**
     * Get sanction orders by status.
     */
    public List<SanctionOrder> getByStatus(
            String status) {

        return sanctionOrderRepository.findByStatus(status);
    }


    /**
     * Get all sanction orders.
     */
    public List<SanctionOrder> getAll() {

        return sanctionOrderRepository.findAll();
    }
}