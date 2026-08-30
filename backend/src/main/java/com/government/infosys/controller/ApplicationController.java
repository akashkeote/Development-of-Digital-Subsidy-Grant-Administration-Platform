package com.government.infosys.controller;

import com.government.infosys.dto.CreateApplicationRequest;
import com.government.infosys.dto.application.ApplicationEntityResponseDTO;
import com.government.infosys.entity.Application;
import com.government.infosys.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
            @RequestBody CreateApplicationRequest request) {

        try {

            Application saved =
                    applicationService.submitApplication(request);

            return ResponseEntity.ok(
                    ApplicationEntityResponseDTO.from(saved)
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest().body(
                    Map.of(
                            "success", false,
                            "message", e.getMessage()
                    )
            );

        } catch (IllegalStateException e) {

            return ResponseEntity.badRequest().body(
                    Map.of(
                            "success", false,
                            "message", e.getMessage()
                    )
            );

        } catch (Exception e) {

            return ResponseEntity.internalServerError().body(
                    Map.of(
                            "success", false,
                            "message",
                            "Error submitting application: "
                                    + e.getMessage()
                    )
            );
        }
    }

    /**
     * GET /api/applications?aadhar={aadhar}
     * Fetch applications for a given Aadhaar number.
     */
    @GetMapping
    public ResponseEntity<?> getApplicationsByAadhar(
            @RequestParam(
                    name = "aadhar",
                    required = false
            ) String aadhar) {

        try {

            List<Application> applications =
                    applicationService
                            .getApplicationsByAadhar(aadhar);

            List<ApplicationEntityResponseDTO> response =
                    applications.stream()
                            .map(ApplicationEntityResponseDTO::from)
                            .collect(Collectors.toList());

            return ResponseEntity.ok(response);

        } catch (Exception e) {

            return ResponseEntity.internalServerError().body(
                    Map.of(
                            "success", false,
                            "message",
                            "Error fetching applications: "
                                    + e.getMessage()
                    )
            );
        }
    }

    /**
     * PATCH /api/applications/{id}/status
     * Update application status.
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

            return ResponseEntity.ok(
                    ApplicationEntityResponseDTO.from(updated)
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest().body(
                    Map.of(
                            "success", false,
                            "message", e.getMessage()
                    )
            );

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

            return ResponseEntity.ok(
                    ApplicationEntityResponseDTO.from(application)
            );

        } catch (Exception e) {

            return ResponseEntity.notFound().build();
        }
    }
}