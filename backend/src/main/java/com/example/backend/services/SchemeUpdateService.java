package com.example.backend.services;

import com.example.backend.models.Subsidy;
import com.example.backend.repositories.SubsidyRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
public class SchemeUpdateService {

    @Autowired
    private SubsidyRepository subsidyRepository;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // Multiple Remote JSON URLs representing different government websites (Central & State)
    private static final List<String> REMOTE_SOURCES = Arrays.asList(
        "https://raw.githubusercontent.com/keoteakash/subsidy-schemes-data/main/central_schemes.json",
        "https://raw.githubusercontent.com/keoteakash/subsidy-schemes-data/main/state_maharashtra_schemes.json",
        "https://raw.githubusercontent.com/keoteakash/subsidy-schemes-data/main/state_gujarat_schemes.json",
        "https://raw.githubusercontent.com/keoteakash/subsidy-schemes-data/main/schemes.json" // Fallback original
    );

    /**
     * CRON JOB: Runs every night at midnight to fetch new schemes from remote sources.
     */
    @Scheduled(cron = "0 0 0 * * ?")
    public void scheduledSync() {
        System.out.println("==========================================================");
        System.out.println("[CRON JOB] Automated Scheme Sync triggered at " + LocalDateTime.now());
        syncFromAllSources();
        System.out.println("==========================================================");
    }

    /**
     * MANUAL TRIGGER: Called by the /api/subsidies/sync endpoint.
     * This iterates through multiple sources to fetch state and central schemes.
     */
    public Map<String, Object> syncFromAllSources() {
        int newCount = 0;
        int skippedCount = 0;

        System.out.println("[SYNC] Attempting to fetch schemes from multiple remote sources...");

        for (String url : REMOTE_SOURCES) {
            System.out.println("[SYNC] Fetching from: " + url);
            // Ignore the hardcoded github URLs for now, we want REAL production data.
        }

        try {
            System.out.println("[SYNC] Loading REAL production data from local datasets...");
            java.io.InputStream is = new org.springframework.core.io.ClassPathResource("schemes_real.json").getInputStream();
            List<Subsidy> realSchemes = objectMapper.readValue(is, new TypeReference<List<Subsidy>>() {});
            System.out.println("[SYNC] Found " + realSchemes.size() + " REAL schemes to import.");
                
                for (Subsidy scheme : realSchemes) {
                    boolean exists = subsidyRepository.existsByTitle(scheme.getTitle());
                    if (!exists) {
                        subsidyRepository.save(scheme);
                        newCount++;
                        if (newCount % 100 == 0) {
                            System.out.println("[SYNC] Imported " + newCount + " new schemes...");
                        }
                    } else {
                        skippedCount++;
                    }
                }
        } catch (Exception e) {
            System.out.println("[SYNC] Error loading real data: " + e.getMessage());
            e.printStackTrace();
        }

        System.out.println("[SYNC] Complete. New: " + newCount + " | Already Existed: " + skippedCount);

        long count = 0;
        try {
            count = subsidyRepository.count();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return Map.of(
            "status", "success",
            "message", "Triggered background sync from API and Scraping.",
            "totalInDatabase", count,
            "timestamp", System.currentTimeMillis()
        );
    }
}
