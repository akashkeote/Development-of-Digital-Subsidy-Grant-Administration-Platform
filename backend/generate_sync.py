import os

base_dir = "src/main/java/com/government/infosys"
scheduler_dir = os.path.join(base_dir, "scheduler")

files = {}

files[os.path.join(scheduler_dir, "DailySchemeSyncJob.java")] = '''package com.government.infosys.scheduler;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.government.infosys.entity.Department;
import com.government.infosys.entity.Scheme;
import com.government.infosys.repository.DepartmentRepository;
import com.government.infosys.repository.SchemeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Component
public class DailySchemeSyncJob {
    @Autowired private SchemeRepository schemeRepository;
    @Autowired private DepartmentRepository departmentRepository;

    @Scheduled(cron = "0 0 2 * * *") // Daily at 2 AM
    @Transactional
    public void syncSchemesFromJson() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            InputStream is = new ClassPathResource("schemes.json").getInputStream();
            List<Map<String, Object>> schemesData = mapper.readValue(is, new TypeReference<List<Map<String, Object>>>() {});

            Department defaultDept = departmentRepository.findById(1L).orElseGet(() -> {
                Department d = new Department();
                d.setCode("DEPT_001");
                d.setName("Default Department");
                return departmentRepository.save(d);
            });

            for (Map<String, Object> data : schemesData) {
                String code = (String) data.get("id");
                if (code == null) continue;
                
                Scheme scheme = schemeRepository.findByCode(code).orElse(new Scheme());
                scheme.setCode(code);
                scheme.setName(data.get("title") != null ? (String) data.get("title") : "Unnamed Scheme");
                scheme.setDescription((String) data.get("description"));
                
                Object amountObj = data.get("amount");
                if (amountObj != null) {
                    scheme.setMaxAmount(new BigDecimal(amountObj.toString()));
                    if (scheme.getTotalBudget() == null) scheme.setTotalBudget(new BigDecimal(amountObj.toString()).multiply(new BigDecimal("1000")));
                }
                
                scheme.setDepartment(defaultDept);
                scheme.setStartDate(LocalDate.now());
                scheme.setIsActive(true);
                
                schemeRepository.save(scheme);
            }
            System.out.println("Successfully synced " + schemesData.size() + " schemes from JSON.");
        } catch (Exception e) {
            System.err.println("Failed to sync schemes from JSON: " + e.getMessage());
        }
    }
}
'''

for path, content in files.items():
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

print("Daily Scheme Sync Job generated.")
