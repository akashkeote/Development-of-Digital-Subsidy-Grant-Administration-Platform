package com.government.infosys.repository;
import com.government.infosys.entity.DisbursementMilestone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
@Repository
public interface DisbursementMilestoneRepository extends JpaRepository<DisbursementMilestone, Long> {
    List<DisbursementMilestone> findByPlanIdOrderByStageNumberAsc(Long planId);
    
    @Query("SELECT m FROM DisbursementMilestone m WHERE m.completionStatus = 'PENDING' AND m.dueDate BETWEEN :startDate AND :endDate")
    List<DisbursementMilestone> findPendingMilestonesDueBetween(LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT m FROM DisbursementMilestone m WHERE m.completionStatus = 'PENDING' AND m.dueDate < :date")
    List<DisbursementMilestone> findPendingMilestonesPastDue(LocalDate date);
    
    List<DisbursementMilestone> findByCompletionStatus(String status);
}
