package com.government.infosys.controller;

import com.government.infosys.dto.EligibilityResult;
import com.government.infosys.service.EligibilityEngineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/eligibility")
@CrossOrigin(origins = "*")
public class EligibilityController {

    @Autowired
    private EligibilityEngineService eligibilityEngineService;

    /**
     * Evaluate an applicant against the eligibility rules
     * configured for a scheme.
     *
     * Example:
     * POST /api/eligibility/evaluate/1
     */
    @PostMapping("/evaluate/{schemeId}")
    public ResponseEntity<EligibilityResult> evaluateEligibility(
            @PathVariable Long schemeId,
            @RequestBody Map<String, Object> applicantData) {

        EligibilityResult result =
                eligibilityEngineService.evaluateEligibility(
                        schemeId,
                        applicantData
                );

        return ResponseEntity.ok(result);
    }
}