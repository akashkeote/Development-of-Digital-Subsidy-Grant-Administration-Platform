package com.government.infosys.repository;
import com.government.infosys.entity.VerificationWorkflow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface VerificationWorkflowRepository extends JpaRepository<VerificationWorkflow, Long> {
    List<VerificationWorkflow> findByApplicationId(Long applicationId);
}
