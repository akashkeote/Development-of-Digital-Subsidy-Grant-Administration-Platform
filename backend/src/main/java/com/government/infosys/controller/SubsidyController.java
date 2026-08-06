package com.government.infosys.controller;

import com.government.infosys.entity.Subsidy;
import com.government.infosys.service.SubsidyService;
import com.government.infosys.service.SchemeUpdateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/subsidies")
@CrossOrigin(origins = "*")
public class SubsidyController {

    @Autowired
    private SubsidyService subsidyService;

    @Autowired
    private SchemeUpdateService schemeUpdateService;

    /**
     * GET /api/subsidies
     * Fetch active schemes with optional filters.
     *
     * Params:
     *   state    - exact state name (e.g. "Maharashtra", "All States" to skip)
     *   category - exact category   (e.g. "Health & Wellness", "All Categories" to skip)
     *   ministry - exact ministry   (e.g. "Ministry Of Finance", "All Ministries" to skip)
     *   search   - keyword search across title, description, ministry, category, state
     *   limit    - max results (default 20)
     */
    @GetMapping
    public ResponseEntity<List<Subsidy>> getAllSubsidies(
            @RequestParam(name = "state",    required = false) String state,
            @RequestParam(name = "category", required = false) String category,
            @RequestParam(name = "ministry", required = false) String ministry,
            @RequestParam(name = "search",   required = false) String search,
            @RequestParam(name = "limit", defaultValue = "20") int limit) throws Exception {

        List<Subsidy> subsidies = subsidyService.getSubsidies(state, category, search, ministry, limit);
        return ResponseEntity.ok(subsidies);
    }

    /**
     * GET /api/subsidies/stats
     * Returns aggregated statistics for the dashboard and analytics:
     * {
     *   "totalSchemes": 4680,
     *   "byState":    { "Maharashtra": 84, "Gujarat": 641, ... },
     *   "byCategory": { "Health & Wellness": 320, ... },
     *   "byMinistry": { "Ministry Of Finance": 95, ... }
     * }
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(subsidyService.getStats());
    }

    /**
     * POST /api/subsidies/sync
     * Manually trigger background sync from remote GitHub JSON sources.
     */
    @PostMapping("/sync")
    public ResponseEntity<Map<String, Object>> syncSchemes() {
        Map<String, Object> result = schemeUpdateService.syncFromAllSources();
        return ResponseEntity.ok(result);
    }

    /**
     * GET /api/subsidies/{id}
     * Fetch a single scheme by its ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Subsidy> getSubsidyById(@PathVariable String id) {
        try {
            Subsidy subsidy = subsidyService.getSubsidyById(id);
            return ResponseEntity.ok(subsidy);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * POST /api/subsidies
     * Admin: Add a new scheme manually.
     */
    @PostMapping
    public ResponseEntity<Subsidy> createSubsidy(@RequestBody Subsidy subsidy) throws Exception {
        Subsidy savedSubsidy = subsidyService.saveSubsidy(subsidy);
        return ResponseEntity.ok(savedSubsidy);
    }

    /**
     * PUT /api/subsidies/{id}
     * Admin: Update or deactivate an existing scheme.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Subsidy> updateSubsidy(@PathVariable String id, @RequestBody Subsidy subsidy) {
        try {
            Subsidy updatedSubsidy = subsidyService.updateSubsidy(id, subsidy);
            return ResponseEntity.ok(updatedSubsidy);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}