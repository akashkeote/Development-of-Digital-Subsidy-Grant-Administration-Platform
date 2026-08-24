package com.government.infosys.repository;
import com.government.infosys.entity.DisbursementPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
@Repository
public interface DisbursementPlanRepository extends JpaRepository<DisbursementPlan, Long> {
    Optional<DisbursementPlan> findByApplicationId(Long applicationId);
}
