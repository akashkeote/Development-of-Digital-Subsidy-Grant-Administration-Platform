package com.example.backend.seeders;

import com.example.backend.models.Subsidy;
import com.example.backend.repositories.SubsidyRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.List;
import java.util.UUID;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private SubsidyRepository subsidyRepository;

    @Override
    public void run(String... args) throws Exception {
        long existingCount = subsidyRepository.count();

        if (existingCount > 0) {
            System.out.println("==========================================================");
            System.out.println("📊 Supabase DB already has " + existingCount + " schemes. Skipping seed.");
            System.out.println("==========================================================");
            return;
        }

        System.out.println("📦 Supabase DB is empty. Seeding from JSON...");

        try {
            ObjectMapper mapper = new ObjectMapper();
            // Load the enriched REAL data from myscheme.gov.in
            InputStream is;
            try {
                is = new ClassPathResource("schemes_real.json").getInputStream();
            } catch (Exception e) {
                is = new ClassPathResource("data/schemes.json").getInputStream();
            }

            List<Subsidy> schemes = mapper.readValue(is, new TypeReference<List<Subsidy>>() {});

            // Assign IDs if missing
            for (Subsidy s : schemes) {
                if (s.getId() == null || s.getId().isEmpty()) {
                    s.setId(UUID.randomUUID().toString());
                }
            }

            // Batch save (500 at a time to avoid timeout)
            int batchSize = 500;
            for (int i = 0; i < schemes.size(); i += batchSize) {
                int end = Math.min(i + batchSize, schemes.size());
                List<Subsidy> batch = schemes.subList(i, end);
                subsidyRepository.saveAll(batch);
                System.out.println("✅ Seeded batch " + (i / batchSize + 1) + " (" + end + "/" + schemes.size() + ")");
            }

            System.out.println("==========================================================");
            System.out.println("🎉 Seeded " + schemes.size() + " schemes to Supabase PostgreSQL!");
            System.out.println("==========================================================");
        } catch (Exception e) {
            System.err.println("❌ Seed failed: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
