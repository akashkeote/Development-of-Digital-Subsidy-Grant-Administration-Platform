package com.government.infosys.repository;

import com.government.infosys.entity.SchemeEligibilityRule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SchemeEligibilityRuleRepository
        extends JpaRepository<SchemeEligibilityRule, Long> {

    List<SchemeEligibilityRule> findBySchemeId(Long schemeId);

    List<SchemeEligibilityRule> findBySchemeIdAndMandatoryTrue(Long schemeId);
}