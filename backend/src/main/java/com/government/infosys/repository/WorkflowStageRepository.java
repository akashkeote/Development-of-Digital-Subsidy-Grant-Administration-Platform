package com.government.infosys.repository;

import com.government.infosys.entity.WorkflowStage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WorkflowStageRepository extends JpaRepository<WorkflowStage, Long> {

    Optional<WorkflowStage> findByCode(String code);

}