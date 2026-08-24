package com.government.infosys.controller;
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
