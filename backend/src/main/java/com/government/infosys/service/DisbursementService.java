package com.government.infosys.service;
import com.government.infosys.entity.*;
import com.government.infosys.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class DisbursementService {
    @Autowired private DisbursementPlanRepository planRepository;
    @Autowired private DisbursementMilestoneRepository milestoneRepository;
    @Autowired private SchemeRepository schemeRepository;
    @Autowired private AuditLogRepository auditLogRepository;

    @Transactional
    public void configurePlan(Long planId, List<DisbursementMilestone> stages) {
        DisbursementPlan plan = planRepository.findById(planId).orElseThrow();
        BigDecimal sum = stages.stream().map(DisbursementMilestone::getAmountToRelease).reduce(BigDecimal.ZERO, BigDecimal::add);
        if (sum.compareTo(plan.getTotalAmount()) != 0) {
            throw new IllegalArgumentException("Stage amounts do not sum to approved grant.");
        }
        stages.forEach(s -> {
            s.setPlan(plan);
            s.setCompletionStatus("PENDING");
        });
        milestoneRepository.saveAll(stages);
    }

    @Transactional
    public void releaseFunds(Long milestoneId) {
        DisbursementMilestone milestone = milestoneRepository.findById(milestoneId).orElseThrow();
        DisbursementPlan plan = milestone.getPlan();

        // Sequential Block Check
        List<DisbursementMilestone> allStages = milestoneRepository.findByPlanIdOrderByStageNumberAsc(plan.getId());
        for (DisbursementMilestone m : allStages) {
            if (m.getStageNumber() < milestone.getStageNumber() && !m.getCompletionStatus().equals("RELEASED")) {
                throw new IllegalStateException("Previous stage is not completed/released.");
            }
            if (m.getCompletionStatus().equals("OVERDUE")) {
                throw new IllegalStateException("Cannot release funds while a stage is OVERDUE.");
            }
        }

        milestone.setCompletionStatus("RELEASED");
        milestone.setAmountReleased(milestone.getAmountToRelease());
        milestone.setReleaseDate(LocalDateTime.now());

        Scheme scheme = plan.getApplication().getScheme();
        scheme.setBudgetUsed(scheme.getBudgetUsed().add(milestone.getAmountReleased()));
        schemeRepository.save(scheme);
        
        milestoneRepository.save(milestone);

        AuditLog audit = AuditLog.builder()
            .username("SYSTEM").action("DISBURSEMENT_RELEASED").entity("DisbursementMilestone")
            .entityId(milestoneId).oldStatus("PENDING").newStatus("RELEASED")
            .timestamp(LocalDateTime.now()).build();
        auditLogRepository.save(audit);
    }

    @Transactional
    public void resolveOverdue(Long milestoneId, String reason) {
        DisbursementMilestone milestone = milestoneRepository.findById(milestoneId).orElseThrow();
        if ("OVERDUE".equals(milestone.getCompletionStatus())) {
            milestone.setCompletionStatus("COMPLETED");
            milestone.setCompletedDate(LocalDateTime.now());
            milestoneRepository.save(milestone);
            
            AuditLog audit = AuditLog.builder()
                .username("ADMIN").action("RESOLVED_OVERDUE").entity("DisbursementMilestone")
                .entityId(milestoneId).oldStatus("OVERDUE").newStatus("COMPLETED")
                .timestamp(LocalDateTime.now()).build();
            auditLogRepository.save(audit);
        }
    }
}
