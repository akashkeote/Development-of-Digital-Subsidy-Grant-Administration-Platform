package com.government.infosys.repository;

import com.government.infosys.entity.EligibilityCriteriaMaster;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EligibilityCriteriaMasterRepository
        extends JpaRepository<EligibilityCriteriaMaster, Long> {

    Optional<EligibilityCriteriaMaster> findByCode(String code);

    List<EligibilityCriteriaMaster> findByActiveTrue();
}