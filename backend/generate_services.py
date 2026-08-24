import os

base_dir = "src/main/java/com/government/infosys"
service_dir = os.path.join(base_dir, "service")
controller_dir = os.path.join(base_dir, "controller")
scheduler_dir = os.path.join(base_dir, "scheduler")

files = {}

files[os.path.join(service_dir, "EligibilityScoringService.java")] = '''package com.government.infosys.service;
import com.government.infosys.entity.*;
import com.government.infosys.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
public class EligibilityScoringService {
    @Autowired private ApplicationRepository applicationRepository;
    @Autowired private EligibilityRuleRepository eligibilityRuleRepository;
    @Autowired private EligibilityScoreLogRepository scoreLogRepository;
    @Autowired private VerificationWorkflowRepository workflowRepository;
    @Autowired private StatusRepository statusRepository;

    @Transactional
    public Application processApplicationSubmission(Application app, CitizenProfile citizen) {
        EligibilityRule rule = eligibilityRuleRepository.findBySchemeId(app.getScheme().getId())
                .orElseThrow(() -> new RuntimeException("Eligibility rules not found for scheme"));

        int totalScore = 0;
        
        // 1. Income Check
        int incomeScore = 0;
        // mock logic for income vs maxIncome
        if (rule.getMaxIncome() != null) {
            incomeScore = rule.getIncomeWeight(); // assuming they pass
        }
        totalScore += incomeScore;
        saveLog(app, "Income Level", rule.getIncomeWeight(), incomeScore);

        // 2. Category Match
        int categoryScore = 0;
        if (rule.getCategoryMatch() == null || rule.getCategoryMatch().equals("ALL")) {
            categoryScore = rule.getCategoryWeight();
        }
        totalScore += categoryScore;
        saveLog(app, "Category Match", rule.getCategoryWeight(), categoryScore);

        // 3. Document Completeness
        int docsScore = rule.getDocsWeight(); // Assuming all docs uploaded for now
        totalScore += docsScore;
        saveLog(app, "Document Completeness", rule.getDocsWeight(), docsScore);

        Status newStatus;
        if (totalScore >= rule.getPassingScore()) {
            newStatus = statusRepository.findByCode("FIELD_OFFICER_PENDING").orElse(null);
            
            VerificationWorkflow workflow = VerificationWorkflow.builder()
                .application(app)
                .stage("FIELD_OFFICER")
                .actionTaken("ASSIGNED")
                .comments("Passed eligibility with score " + totalScore)
                .timestamp(LocalDateTime.now())
                .build();
            workflowRepository.save(workflow);
        } else {
            newStatus = statusRepository.findByCode("REJECTED").orElse(null);
        }
        
        if(newStatus != null) app.setCurrentStatus(newStatus);
        return applicationRepository.save(app);
    }

    private void saveLog(Application app, String criterion, int weight, int score) {
        EligibilityScoreLog log = EligibilityScoreLog.builder()
            .application(app).criterion(criterion).weight(weight).scoreObtained(score)
            .calculatedAt(LocalDateTime.now()).build();
        scoreLogRepository.save(log);
    }
}
'''

files[os.path.join(service_dir, "VerificationWorkflowService.java")] = '''package com.government.infosys.service;
import com.government.infosys.entity.*;
import com.government.infosys.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
public class VerificationWorkflowService {
    @Autowired private ApplicationRepository applicationRepository;
    @Autowired private VerificationWorkflowRepository workflowRepository;
    @Autowired private AuditLogRepository auditLogRepository;
    @Autowired private DisbursementPlanRepository disbursementPlanRepository;
    @Autowired private NotificationRepository notificationRepository;

    @Transactional
    public void processAction(Long applicationId, String stage, String action, String comments, String user) {
        Application app = applicationRepository.findById(applicationId).orElseThrow();
        String oldStatus = app.getCurrentStatus() != null ? app.getCurrentStatus().getName() : "UNKNOWN";

        VerificationWorkflow workflow = VerificationWorkflow.builder()
            .application(app).stage(stage).actionTaken(action).comments(comments)
            .timestamp(LocalDateTime.now()).build();
        workflowRepository.save(workflow);

        // State machine logic
        if (action.equals("APPROVE")) {
            if (stage.equals("FIELD_OFFICER")) stage = "DISTRICT_OFFICER";
            else if (stage.equals("DISTRICT_OFFICER")) stage = "FINANCE_APPROVER";
            else if (stage.equals("FINANCE_APPROVER")) {
                stage = "APPROVED";
                createDisbursementPlan(app);
            }
        } else if (action.equals("ESCALATE")) {
            if (stage.equals("FIELD_OFFICER")) stage = "DISTRICT_OFFICER";
            else if (stage.equals("DISTRICT_OFFICER")) stage = "FINANCE_APPROVER";
        } else if (action.equals("REJECT")) {
            stage = "REJECTED";
        }
        
        // Audit log
        AuditLog audit = AuditLog.builder()
            .username(user).action(action).entity("Application").entityId(applicationId)
            .oldStatus(oldStatus).newStatus(stage).timestamp(LocalDateTime.now()).build();
        auditLogRepository.save(audit);

        // Notification
        Notification notif = Notification.builder()
            .user(app.getCitizen().getUser()).message("Application status changed to " + stage)
            .isRead(false).createdAt(LocalDateTime.now()).build();
        notificationRepository.save(notif);
    }

    private void createDisbursementPlan(Application app) {
        DisbursementPlan plan = DisbursementPlan.builder()
            .application(app).totalAmount(app.getScheme().getMaxAmount())
            .totalStages(3).createdAt(LocalDateTime.now()).build();
        disbursementPlanRepository.save(plan);
    }
}
'''

files[os.path.join(controller_dir, "WorkflowController.java")] = '''package com.government.infosys.controller;
import com.government.infosys.service.VerificationWorkflowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/workflow")
public class WorkflowController {
    @Autowired private VerificationWorkflowService workflowService;

    @PostMapping("/{applicationId}/action")
    @PreAuthorize("hasAnyRole('FIELD_OFFICER', 'DISTRICT_OFFICER', 'FINANCE_APPROVER')")
    public ResponseEntity<?> takeAction(@PathVariable Long applicationId,
                                        @RequestParam String stage,
                                        @RequestParam String action,
                                        @RequestParam String comments) {
        // Mock user, normally derived from SecurityContextHolder
        String user = "logged_in_user"; 
        workflowService.processAction(applicationId, stage, action, comments, user);
        return ResponseEntity.ok("Action recorded successfully.");
    }
}
'''

for path, content in files.items():
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

print("Services and WorkflowController generated.")
