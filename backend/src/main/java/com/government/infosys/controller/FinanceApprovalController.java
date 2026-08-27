package com.government.infosys.controller;

import com.government.infosys.entity.FinanceApproval;
import com.government.infosys.service.FinanceApprovalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/finance-approvals")
@CrossOrigin(origins = "*")
public class FinanceApprovalController {

    @Autowired
    private FinanceApprovalService financeApprovalService;


    /**
     * Create a finance approval record.
     *
     * POST /api/finance-approvals
     *
     * Example body:
     * {
     *   "applicationId": 1,
     *   "approvedByUserId": 2,
     *   "approvalStatus": "APPROVED",
     *   "approvedAmount": 50000,
     *   "remarks": "Budget verified and amount approved"
     * }
     */
    @PostMapping
    public ResponseEntity<?> createApproval(
            @RequestBody Map<String, Object> body) {

        try {
            Long applicationId = Long.valueOf(
                    body.get("applicationId").toString()
            );

            Long approvedByUserId = Long.valueOf(
                    body.get("approvedByUserId").toString()
            );

            String approvalStatus =
                    body.get("approvalStatus").toString();

            BigDecimal approvedAmount =
                    body.get("approvedAmount") != null
                            ? new BigDecimal(
                            body.get("approvedAmount").toString()
                    )
                            : null;

            String remarks =
                    body.get("remarks") != null
                            ? body.get("remarks").toString()
                            : null;

            FinanceApproval financeApproval =
                    financeApprovalService.createApproval(
                            applicationId,
                            approvedByUserId,
                            approvalStatus,
                            approvedAmount,
                            remarks
                    );

            return ResponseEntity.ok(financeApproval);

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
     * Get finance approvals for an application.
     *
     * GET /api/finance-approvals/application/{applicationId}
     */
    @GetMapping("/application/{applicationId}")
    public ResponseEntity<List<FinanceApproval>> getByApplicationId(
            @PathVariable Long applicationId) {

        return ResponseEntity.ok(
                financeApprovalService
                        .getByApplicationId(applicationId)
        );
    }


    /**
     * Get approvals made by a finance officer.
     *
     * GET /api/finance-approvals/officer/{userId}
     */
    @GetMapping("/officer/{userId}")
    public ResponseEntity<List<FinanceApproval>> getByOfficer(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                financeApprovalService
                        .getByApprovedByUserId(userId)
        );
    }


    /**
     * Get approvals by status.
     *
     * GET /api/finance-approvals/status/APPROVED
     */
    @GetMapping("/status/{approvalStatus}")
    public ResponseEntity<List<FinanceApproval>> getByStatus(
            @PathVariable String approvalStatus) {

        return ResponseEntity.ok(
                financeApprovalService
                        .getByApprovalStatus(approvalStatus)
        );
    }


    /**
     * Get all finance approval records.
     *
     * GET /api/finance-approvals
     */
    @GetMapping
    public ResponseEntity<List<FinanceApproval>> getAll() {

        return ResponseEntity.ok(
                financeApprovalService.getAll()
        );
    }
}