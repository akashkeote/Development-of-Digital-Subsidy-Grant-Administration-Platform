package com.government.infosys.repository;

import com.government.infosys.entity.DistrictDecision;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DistrictDecisionRepository
        extends JpaRepository<DistrictDecision, Long> {

    List<DistrictDecision> findByApplicationId(Long applicationId);

    List<DistrictDecision> findByDecisionByUserId(Long userId);

    List<DistrictDecision> findByDecision(String decision);
}