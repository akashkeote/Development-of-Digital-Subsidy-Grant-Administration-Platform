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
