package com.government.infosys.controller;

import com.government.infosys.scheduler.ComplianceScheduler;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Profile("dev")
@RequestMapping("/api/v1/test")
public class ComplianceTestController {

    private final ComplianceScheduler complianceScheduler;

    public ComplianceTestController(
            ComplianceScheduler complianceScheduler) {
        this.complianceScheduler = complianceScheduler;
    }

    @GetMapping("/run-reminder-check")
    public String runReminderCheck() {

        complianceScheduler.sendUpcomingReminders();

        return "Reminder scheduler executed successfully.";
    }

    @GetMapping("/run-overdue-check")
    public String runOverdueCheck() {

        complianceScheduler.flagOverdueMilestones();

        return "Overdue scheduler executed successfully.";
    }
}