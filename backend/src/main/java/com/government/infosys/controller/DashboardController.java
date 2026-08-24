package com.government.infosys.controller;
import com.government.infosys.repository.SchemeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {
    @Autowired private SchemeRepository schemeRepository;

    @GetMapping("/schemes")
    public ResponseEntity<?> getSchemeSummary() {
        return ResponseEntity.ok(schemeRepository.findAll().stream().map(s -> {
            Map<String, Object> map = new HashMap<>();
            map.put("name", s.getName());
            map.put("totalBudget", s.getTotalBudget());
            map.put("budgetUsed", s.getBudgetUsed());
            if (s.getTotalBudget() != null && s.getTotalBudget().doubleValue() > 0) {
                double usage = s.getBudgetUsed().doubleValue() / s.getTotalBudget().doubleValue();
                map.put("exhaustionWarning", usage > 0.80);
            }
            return map;
        }));
    }
}
