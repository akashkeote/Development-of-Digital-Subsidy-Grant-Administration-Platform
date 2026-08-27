package com.government.infosys.service;

import com.government.infosys.entity.Application;
import com.government.infosys.entity.DistrictDecision;
import com.government.infosys.repository.ApplicationJpaRepository;
import com.government.infosys.repository.DistrictDecisionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DistrictDecisionService {

    @Autowired
    private DistrictDecisionRepository districtDecisionRepository;

    @Autowired
    private ApplicationJpaRepository applicationRepository;


    /**
     * Create a district-level decision for an application.
     */
    public DistrictDecision createDecision(
            Long applicationId,
            Long decisionByUserId,
            String decision,
            String remarks) {

        Application application = applicationRepository
                .findById(applicationId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Application not found: " + applicationId
                        )
                );

        DistrictDecision districtDecision =
                DistrictDecision.builder()
                        .application(application)
                        .decisionByUserId(decisionByUserId)
                        .decision(decision)
                        .remarks(remarks)
                        .decidedAt(LocalDateTime.now())
                        .build();

        return districtDecisionRepository.save(districtDecision);
    }


    /**
     * Get all district decisions for a specific application.
     */
    public List<DistrictDecision> getByApplicationId(
            Long applicationId) {

        return districtDecisionRepository
                .findByApplicationId(applicationId);
    }


    /**
     * Get all decisions made by a particular officer.
     */
    public List<DistrictDecision> getByDecisionByUserId(
            Long userId) {

        return districtDecisionRepository
                .findByDecisionByUserId(userId);
    }


    /**
     * Get decisions based on their status.
     * Example: APPROVED / REJECTED / PENDING
     */
    public List<DistrictDecision> getByDecision(
            String decision) {

        return districtDecisionRepository
                .findByDecision(decision);
    }


    /**
     * Get all district decisions.
     */
    public List<DistrictDecision> getAll() {

        return districtDecisionRepository.findAll();
    }
}