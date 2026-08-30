package com.government.infosys.controller;

import com.government.infosys.dto.CreateCitizenProfileRequest;
import com.government.infosys.entity.CitizenProfile;
import com.government.infosys.service.CitizenProfileService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.government.infosys.dto.CitizenProfileResponse;

import java.util.Map;

@RestController
@RequestMapping("/api/citizen-profiles")
@CrossOrigin(origins = "*")
public class CitizenProfileController {

    @Autowired
    private CitizenProfileService citizenProfileService;

    /**
     * POST /api/citizen-profiles
     *
     * Create a citizen profile.
     */
    @PostMapping
    public ResponseEntity<?> createProfile(
            @Valid @RequestBody CreateCitizenProfileRequest request) {

        try {

            CitizenProfile profile =
                    citizenProfileService.createProfile(request);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(CitizenProfileResponse.from(profile));

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "success", false,
                            "message", e.getMessage()
                    ));

        } catch (IllegalStateException e) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "success", false,
                            "message", e.getMessage()
                    ));

        } catch (Exception e) {

            return ResponseEntity
                    .internalServerError()
                    .body(Map.of(
                            "success", false,
                            "message",
                            "Server error: " + e.getMessage()
                    ));
        }
    }

    /**
     * GET /api/citizen-profiles/user/{userId}
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getByUserId(
            @PathVariable Long userId) {

        try {

            CitizenProfile profile =
                    citizenProfileService.getByUserId(userId);

            return ResponseEntity.ok(
                    CitizenProfileResponse.from(profile)
            );


        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "success", false,
                            "message", e.getMessage()
                    ));
        }
    }

    /**
     * GET /api/citizen-profiles/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(
            @PathVariable Long id) {

        try {

            CitizenProfile profile =
                    citizenProfileService.getById(id);

            return ResponseEntity.ok(
                    CitizenProfileResponse.from(profile)

            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "success", false,
                            "message", e.getMessage()
                    ));
        }
    }
}