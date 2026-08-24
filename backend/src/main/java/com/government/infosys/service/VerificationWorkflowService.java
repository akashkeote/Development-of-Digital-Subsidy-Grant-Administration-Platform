package com.government.infosys.service;
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
