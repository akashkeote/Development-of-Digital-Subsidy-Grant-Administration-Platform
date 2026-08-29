package com.government.infosys.scheduler;
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
import com.government.infosys.entity.AuditLog;
import com.government.infosys.repository.AuditLogRepository;

@Component
public class ComplianceScheduler {
    @Autowired private DisbursementMilestoneRepository milestoneRepository;
    @Autowired private NotificationRepository notificationRepository;
    @Autowired
    private AuditLogRepository auditLogRepository;

    @Scheduled(cron = "0 0 9 * * *") // Daily at 9 AM
    @Transactional
    public void sendUpcomingReminders() {
        LocalDate today = LocalDate.now();
        LocalDate threeDaysFromNow = today.plusDays(3);
        List<DisbursementMilestone> upcoming = milestoneRepository.findPendingMilestonesDueBetween(today, threeDaysFromNow);
        
        for (DisbursementMilestone m : upcoming) {

            LocalDateTime startOfDay = today.atStartOfDay();
            LocalDateTime startOfTomorrow = today.plusDays(1).atStartOfDay();

            boolean alreadySent =
                    notificationRepository
                            .existsByReferenceTypeAndReferenceIdAndCreatedAtBetween(
                                    "MILESTONE_REMINDER",
                                    m.getId(),
                                    startOfDay,
                                    startOfTomorrow
                            );

            if (alreadySent) {
                continue;
            }

            Notification notif = Notification.builder()
                    .user(m.getPlan().getApplication().getCitizen().getUser())
                    .channel("IN_APP")
                    .subject("Milestone Reminder")
                    .message(
                            "Reminder: Milestone '" +
                                    m.getMilestoneName() +
                                    "' is due soon."
                    )
                    .status("PENDING")
                    .referenceType("MILESTONE_REMINDER")
                    .referenceId(m.getId())
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

            // Only process PENDING milestones.
            // This also makes the job safe if it runs multiple times.
            if (!"PENDING".equals(m.getCompletionStatus())) {
                continue;
            }

            String oldStatus = m.getCompletionStatus();

            m.setCompletionStatus("OVERDUE");
            milestoneRepository.save(m);

            AuditLog audit = AuditLog.builder()
                    .username("SYSTEM")
                    .action("MILESTONE_OVERDUE")
                    .entity("DisbursementMilestone")
                    .entityId(m.getId())
                    .oldStatus(oldStatus)
                    .newStatus("OVERDUE")
                    .timestamp(LocalDateTime.now())
                    .build();

            auditLogRepository.save(audit);
        }
    }
}
