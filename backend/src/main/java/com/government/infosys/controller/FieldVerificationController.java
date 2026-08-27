package com.government.infosys.controller;

import com.government.infosys.entity.FieldVerification;
import com.government.infosys.service.FieldVerificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/verifications")
@CrossOrigin(origins = "*")
public class FieldVerificationController {

    @Autowired
    private FieldVerificationService fieldVerificationService;

    /**
     * Create a field verification record.
     *
     * POST /api/verifications
     *
     * Example body:
     * {
     *   "applicationId": 1,
     *   "verifierUserId": 2,
     *   "verificationStatus": "VERIFIED",
     *   "remarks": "Documents and field details verified successfully"
     * }
     */
    @PostMapping
    public ResponseEntity<?> createVerification(
            @RequestBody Map<String, Object> body) {

        try {
            Long applicationId =
                    Long.valueOf(body.get("applicationId").toString());

            Long verifierUserId =
                    Long.valueOf(body.get("verifierUserId").toString());

            String verificationStatus =
                    body.get("verificationStatus").toString();

            String remarks =
                    body.get("remarks") != null
                            ? body.get("remarks").toString()
                            : null;

            FieldVerification verification =
                    fieldVerificationService.createVerification(
                            applicationId,
                            verifierUserId,
                            verificationStatus,
                            remarks
                    );

            return ResponseEntity.ok(verification);

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
     * Get verification records for an application.
     *
     * GET /api/verifications/application/{applicationId}
     */
    @GetMapping("/application/{applicationId}")
    public ResponseEntity<List<FieldVerification>>
    getByApplicationId(
            @PathVariable Long applicationId) {

        return ResponseEntity.ok(
                fieldVerificationService
                        .getByApplicationId(applicationId)
        );
    }

    /**
     * Get verification records assigned to a verifier.
     *
     * GET /api/verifications/verifier/{verifierUserId}
     */
    @GetMapping("/verifier/{verifierUserId}")
    public ResponseEntity<List<FieldVerification>>
    getByVerifierUserId(
            @PathVariable Long verifierUserId) {

        return ResponseEntity.ok(
                fieldVerificationService
                        .getByVerifierUserId(verifierUserId)
        );
    }

    /**
     * Get all verification records.
     *
     * GET /api/verifications
     */
    @GetMapping
    public ResponseEntity<List<FieldVerification>> getAll() {

        return ResponseEntity.ok(
                fieldVerificationService.getAll()
        );
    }
}