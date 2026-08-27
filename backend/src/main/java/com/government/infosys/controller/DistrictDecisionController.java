package com.government.infosys.controller;

import com.government.infosys.entity.DistrictDecision;
import com.government.infosys.service.DistrictDecisionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/district-decisions")
@CrossOrigin(origins = "*")
public class DistrictDecisionController {

    @Autowired
    private DistrictDecisionService districtDecisionService;


    /**
     * Create a district-level decision.
     *
     * POST /api/district-decisions
     *
     * Example body:
     * {
     *   "applicationId": 1,
     *   "decisionByUserId": 2,
     *   "decision": "APPROVED",
     *   "remarks": "Application verified and approved at district level"
     * }
     */
    @PostMapping
    public ResponseEntity<?> createDecision(
            @RequestBody Map<String, Object> body) {

        try {
            Long applicationId = Long.valueOf(
                    body.get("applicationId").toString()
            );

            Long decisionByUserId = Long.valueOf(
                    body.get("decisionByUserId").toString()
            );

            String decision = body.get("decision").toString();

            String remarks = body.get("remarks") != null
                    ? body.get("remarks").toString()
                    : null;

            DistrictDecision districtDecision =
                    districtDecisionService.createDecision(
                            applicationId,
                            decisionByUserId,
                            decision,
                            remarks
                    );

            return ResponseEntity.ok(districtDecision);

        } catch (Exception e) {

            return ResponseEntity.badRequest().body(
                    Map.of(
                            "error",
                            e.getMessage()
                    )
            );
        }
    }


    /**
     * Get all decisions for an application.
     *
     * GET /api/district-decisions/application/{applicationId}
     */
    @GetMapping("/application/{applicationId}")
    public ResponseEntity<List<DistrictDecision>> getByApplicationId(
            @PathVariable Long applicationId) {

        return ResponseEntity.ok(
                districtDecisionService
                        .getByApplicationId(applicationId)
        );
    }


    /**
     * Get all decisions made by a specific officer.
     *
     * GET /api/district-decisions/officer/{userId}
     */
    @GetMapping("/officer/{userId}")
    public ResponseEntity<List<DistrictDecision>> getByOfficer(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                districtDecisionService
                        .getByDecisionByUserId(userId)
        );
    }


    /**
     * Get decisions by decision type.
     *
     * GET /api/district-decisions/status/APPROVED
     */
    @GetMapping("/status/{decision}")
    public ResponseEntity<List<DistrictDecision>> getByDecision(
            @PathVariable String decision) {

        return ResponseEntity.ok(
                districtDecisionService.getByDecision(decision)
        );
    }


    /**
     * Get all district decisions.
     *
     * GET /api/district-decisions
     */
    @GetMapping
    public ResponseEntity<List<DistrictDecision>> getAll() {

        return ResponseEntity.ok(
                districtDecisionService.getAll()
        );
    }
}