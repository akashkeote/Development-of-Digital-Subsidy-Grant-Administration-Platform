package com.example.backend.controllers;

import com.example.backend.models.Application;
import com.example.backend.services.ApplicationService;
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
     * Submit a new scheme application (saves to Supabase PostgreSQL).
     * Body: { schemeId, schemeTitle, applicantName, applicantAadhar, applicantState, applicantIncome }
     */
    @PostMapping
    public ResponseEntity<?> submitApplication(@RequestBody Application application) {
        try {
            Application saved = applicationService.submitApplication(application);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                Map.of("error", "Error submitting application: " + e.getMessage())
            );
        }
    }

    /**
     * GET /api/applications?aadhar={aadhar}
     * Fetch all applications for a given Aadhar number (user's history).
     */
    @GetMapping
    public ResponseEntity<List<Application>> getApplicationsByAadhar(
            @RequestParam(name = "aadhar", required = false) String aadhar) {
        List<Application> apps = applicationService.getApplicationsByAadhar(aadhar);
        return ResponseEntity.ok(apps);
    }

    /**
     * PATCH /api/applications/{id}/status
     * Update the status of an application.
     * Body: { "status": "APPROVED" }
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        try {
            Application updated = applicationService.updateStatus(id, body.get("status"));
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
    public ResponseEntity<?> getById(@PathVariable String id) {
        try {
            Application app = applicationService.getById(id);
            return ResponseEntity.ok(app);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
