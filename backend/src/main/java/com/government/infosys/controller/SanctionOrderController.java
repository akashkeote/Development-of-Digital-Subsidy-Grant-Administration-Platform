package com.government.infosys.controller;

import com.government.infosys.entity.SanctionOrder;
import com.government.infosys.service.SanctionOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sanction-orders")
@CrossOrigin(origins = "*")
public class SanctionOrderController {

    @Autowired
    private SanctionOrderService sanctionOrderService;


    /**
     * Create a sanction order.
     *
     * POST /api/sanction-orders
     *
     * Example body:
     * {
     *   "applicationId": 1,
     *   "sanctionOrderNumber": "SO-2026-001",
     *   "sanctionedAmount": 50000,
     *   "issuedByUserId": 2,
     *   "status": "ISSUED",
     *   "remarks": "Sanction order issued after finance approval"
     * }
     */
    @PostMapping
    public ResponseEntity<?> createSanctionOrder(
            @RequestBody Map<String, Object> body) {

        try {
            Long applicationId = Long.valueOf(
                    body.get("applicationId").toString()
            );

            String sanctionOrderNumber =
                    body.get("sanctionOrderNumber").toString();

            BigDecimal sanctionedAmount =
                    new BigDecimal(
                            body.get("sanctionedAmount").toString()
                    );

            Long issuedByUserId = Long.valueOf(
                    body.get("issuedByUserId").toString()
            );

            String status =
                    body.get("status").toString();

            String remarks =
                    body.get("remarks") != null
                            ? body.get("remarks").toString()
                            : null;

            SanctionOrder sanctionOrder =
                    sanctionOrderService.createSanctionOrder(
                            applicationId,
                            sanctionOrderNumber,
                            sanctionedAmount,
                            issuedByUserId,
                            status,
                            remarks
                    );

            return ResponseEntity.ok(sanctionOrder);

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
     * Get sanction order by ID.
     *
     * GET /api/sanction-orders/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(
            @PathVariable Long id) {

        try {
            return ResponseEntity.ok(
                    sanctionOrderService.getById(id)
            );

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
     * Get sanction order using its order number.
     *
     * GET /api/sanction-orders/number/{sanctionOrderNumber}
     */
    @GetMapping("/number/{sanctionOrderNumber}")
    public ResponseEntity<?> getByOrderNumber(
            @PathVariable String sanctionOrderNumber) {

        try {
            return ResponseEntity.ok(
                    sanctionOrderService
                            .getByOrderNumber(sanctionOrderNumber)
            );

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
     * Get all sanction orders for an application.
     *
     * GET /api/sanction-orders/application/{applicationId}
     */
    @GetMapping("/application/{applicationId}")
    public ResponseEntity<List<SanctionOrder>> getByApplicationId(
            @PathVariable Long applicationId) {

        return ResponseEntity.ok(
                sanctionOrderService
                        .getByApplicationId(applicationId)
        );
    }


    /**
     * Get sanction orders issued by a particular user.
     *
     * GET /api/sanction-orders/officer/{userId}
     */
    @GetMapping("/officer/{userId}")
    public ResponseEntity<List<SanctionOrder>> getByOfficer(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                sanctionOrderService
                        .getByIssuedByUserId(userId)
        );
    }


    /**
     * Get sanction orders by status.
     *
     * GET /api/sanction-orders/status/ISSUED
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<SanctionOrder>> getByStatus(
            @PathVariable String status) {

        return ResponseEntity.ok(
                sanctionOrderService.getByStatus(status)
        );
    }


    /**
     * Get all sanction orders.
     *
     * GET /api/sanction-orders
     */
    @GetMapping
    public ResponseEntity<List<SanctionOrder>> getAll() {

        return ResponseEntity.ok(
                sanctionOrderService.getAll()
        );
    }
}