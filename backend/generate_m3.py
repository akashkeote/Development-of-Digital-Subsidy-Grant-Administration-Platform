import os

base_dir = "src/main/java/com/government/infosys"
service_dir = os.path.join(base_dir, "service")
controller_dir = os.path.join(base_dir, "controller")
scheduler_dir = os.path.join(base_dir, "scheduler")

files = {}

files[os.path.join(service_dir, "DisbursementService.java")] = '''package com.government.infosys.service;
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
'''

files[os.path.join(controller_dir, "DisbursementController.java")] = '''package com.government.infosys.controller;
import com.government.infosys.entity.DisbursementMilestone;
import com.government.infosys.service.DisbursementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/disbursement")
public class DisbursementController {
    @Autowired private DisbursementService disbursementService;

    @PostMapping("/plan/{planId}/configure")
    public ResponseEntity<?> configurePlan(@PathVariable Long planId, @RequestBody List<DisbursementMilestone> stages) {
        disbursementService.configurePlan(planId, stages);
        return ResponseEntity.ok("Plan configured.");
    }

    @PostMapping("/release/{milestoneId}")
    public ResponseEntity<?> releaseStage(@PathVariable Long milestoneId) {
        disbursementService.releaseFunds(milestoneId);
        return ResponseEntity.ok("Funds released.");
    }

    @PutMapping("/milestone/{id}/resolve")
    public ResponseEntity<?> resolveOverdue(@PathVariable Long id, @RequestParam String reason) {
        disbursementService.resolveOverdue(id, reason);
        return ResponseEntity.ok("Milestone resolved.");
    }
}
'''

files[os.path.join(scheduler_dir, "ComplianceScheduler.java")] = '''package com.government.infosys.scheduler;
import com.government.infosys.entity.DisbursementMilestone;
import com.government.infosys.entity.Notification;
import com.government.infosys.repository.DisbursementMilestoneRepository;
import com.government.infosys.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class ComplianceScheduler {
    @Autowired private DisbursementMilestoneRepository milestoneRepository;
    @Autowired private NotificationRepository notificationRepository;

    @Scheduled(cron = "0 0 9 * * *") // Daily at 9 AM
    @Transactional
    public void sendUpcomingReminders() {
        LocalDate today = LocalDate.now();
        LocalDate threeDaysFromNow = today.plusDays(3);
        List<DisbursementMilestone> upcoming = milestoneRepository.findPendingMilestonesDueBetween(today, threeDaysFromNow);
        
        for (DisbursementMilestone m : upcoming) {
            Notification notif = Notification.builder()
                .user(m.getPlan().getApplication().getCitizen().getUser())
                .message("Reminder: Milestone '" + m.getMilestoneName() + "' is due soon.")
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
            notificationRepository.save(notif);
        }
    }

    @Scheduled(cron = "0 0 10 * * *") // Daily at 10 AM
    @Transactional
    public void flagOverdueMilestones() {
        LocalDate today = LocalDate.now();
        List<DisbursementMilestone> overdue = milestoneRepository.findPendingMilestonesPastDue(today);
        
        for (DisbursementMilestone m : overdue) {
            m.setCompletionStatus("OVERDUE");
            milestoneRepository.save(m);
        }
    }
}
'''

files[os.path.join(controller_dir, "DashboardController.java")] = '''package com.government.infosys.controller;
import com.government.infosys.repository.SchemeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {
    @Autowired private SchemeRepository schemeRepository;

    @GetMapping("/schemes")
    public ResponseEntity<?> getSchemeSummary() {
        return ResponseEntity.ok(schemeRepository.findAll().stream().map(s -> {
            Map<String, Object> map = new HashMap<>();
            map.put("name", s.getName());
            map.put("totalBudget", s.getTotalBudget());
            map.put("budgetUsed", s.getBudgetUsed());
            if (s.getTotalBudget() != null && s.getTotalBudget().doubleValue() > 0) {
                double usage = s.getBudgetUsed().doubleValue() / s.getTotalBudget().doubleValue();
                map.put("exhaustionWarning", usage > 0.80);
            }
            return map;
        }));
    }
}
'''

for path, content in files.items():
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

print("Disbursement and Dashboard files generated.")
