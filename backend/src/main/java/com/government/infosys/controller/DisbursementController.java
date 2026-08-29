package com.government.infosys.controller;
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
    @PutMapping("/milestone/{id}/complete")
    public ResponseEntity<?> completeMilestone(
            @PathVariable Long id) {

        disbursementService.completeMilestone(id);

        return ResponseEntity.ok("Milestone completed.");
    }

    @PutMapping("/milestone/{id}/resolve")
    public ResponseEntity<?> resolveOverdue(@PathVariable Long id, @RequestParam String reason) {
        disbursementService.resolveOverdue(id, reason);
        return ResponseEntity.ok("Milestone resolved.");
    }
}
