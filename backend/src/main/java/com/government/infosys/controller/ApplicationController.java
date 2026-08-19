package com.government.infosys.controller;

import com.government.infosys.entity.Application;
import com.government.infosys.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    /**
     * POST /api/applications
     * Submit a new scheme application.
     */
    @PostMapping
    public ResponseEntity<?> submitApplication(
            @RequestBody Application application) {

        try {
            Application saved =
                    applicationService.submitApplication(application);

            return ResponseEntity.ok(saved);

        } catch (Exception e) {

            return ResponseEntity.internalServerError().body(
                    Map.of(
                            "error",
                            "Error submitting application: "
                                    + e.getMessage()
                    )
            );
        }
    }

    /**
     * GET /api/applications?aadhar={aadhar}
     * Fetch all applications for a given Aadhaar number.
     */
    @GetMapping
    public ResponseEntity<List<Application>> getApplicationsByAadhar(
            @RequestParam(
                    name = "aadhar",
                    required = false
            ) String aadhar) {

        List<Application> applications =
                applicationService.getApplicationsByAadhar(aadhar);

        return ResponseEntity.ok(applications);
    }

    /**
     * PATCH /api/applications/{id}/status
     * Update the status of an application.
     *
     * Body:
     * {
     *     "status": "APPROVED"
     * }
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        try {

            Application updated =
                    applicationService.updateStatus(
                            id,
                            body.get("status")
                    );

            return ResponseEntity.ok(updated);

        } catch (Exception e) {

            return ResponseEntity.notFound().build();
        }
    }

    /**
     * GET /api/applications/{id}
     * Get a single application by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(
            @PathVariable Long id) {

        try {

            Application application =
                    applicationService.getById(id);

            return ResponseEntity.ok(application);

        } catch (Exception e) {

            return ResponseEntity.notFound().build();
        }
    }
}