package com.example.backend.repositories;

import com.example.backend.models.Subsidy;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * In-memory repository that loads scheme data from schemes_real.json.
 * No database, no Firebase, no Supabase — pure local JSON.
 * Data comes from myscheme.gov.in (real government data).
 */
@Service
public class SubsidyRepository {

    private final List<Subsidy> subsidies = new ArrayList<>();
    private final ObjectMapper mapper = new ObjectMapper();

    @PostConstruct
    public void loadFromJson() {
        try {
            // Try enriched data first (4680 schemes from myscheme.gov.in)
            InputStream is = null;
            try {
                is = new ClassPathResource("data/schemes_real.json").getInputStream();
                System.out.println("Loading ENRICHED scheme data from data/schemes_real.json...");
            } catch (Exception e1) {
                try {
                    is = new ClassPathResource("schemes_real.json").getInputStream();
                    System.out.println("Loading REAL scheme data from schemes_real.json...");
                } catch (Exception e2) {
                    // Final fallback
                    is = new ClassPathResource("data/schemes.json").getInputStream();
                    System.out.println("Loading scheme data from data/schemes.json (fallback)...");
                }
            }

            List<Subsidy> loaded = mapper.readValue(is, new TypeReference<List<Subsidy>>() {});
            subsidies.addAll(loaded);
            System.out.println("Loaded " + subsidies.size() + " schemes from JSON successfully!");
        } catch (Exception e) {
            System.err.println("FAILED to load schemes JSON: " + e.getMessage());
        }
    }

    public long count() {
        return subsidies.size();
    }

    public Subsidy save(Subsidy subsidy) {
        if (subsidy.getId() == null || subsidy.getId().isEmpty()) {
            subsidy.setId(UUID.randomUUID().toString());
        }
        // Update existing or add new
        for (int i = 0; i < subsidies.size(); i++) {
            if (subsidies.get(i).getId().equals(subsidy.getId())) {
                subsidies.set(i, subsidy);
                return subsidy;
            }
        }
        subsidies.add(subsidy);
        return subsidy;
    }

    public Optional<Subsidy> findById(String id) {
        return subsidies.stream().filter(s -> id.equals(s.getId())).findFirst();
    }

    public void saveAll(List<Subsidy> newSubsidies) {
        for (Subsidy s : newSubsidies) {
            save(s);
        }
    }

    public List<Subsidy> findAll() {
        return new ArrayList<>(subsidies);
    }

    public List<Subsidy> findAll(int limit) {
        return subsidies.stream().limit(limit).collect(Collectors.toList());
    }

    public List<Subsidy> findByIsActiveTrue(String state, String category, String search, String ministry, int limit) {
        return subsidies.stream()
            .filter(s -> {
                boolean match = s.isActive();
                // State filter: "All States" means no filter; "All" means central/national schemes
                if (state != null && !state.isEmpty() && !state.equalsIgnoreCase("All States")) {
                    match = match && state.equalsIgnoreCase(s.getState());
                }
                // Category filter: exact match (values now aligned between frontend and data)
                if (category != null && !category.isEmpty() && !category.equalsIgnoreCase("All Categories")) {
                    match = match && category.equalsIgnoreCase(s.getCategory());
                }
                // Ministry filter: exact match
                if (ministry != null && !ministry.isEmpty() && !ministry.equalsIgnoreCase("All Ministries")) {
                    match = match && ministry.equalsIgnoreCase(s.getMinistry());
                }
                // Free-text search across multiple fields
                if (search != null && !search.isEmpty()) {
                    String q = search.toLowerCase();
                    match = match && (
                        (s.getTitle() != null && s.getTitle().toLowerCase().contains(q)) ||
                        (s.getDescription() != null && s.getDescription().toLowerCase().contains(q)) ||
                        (s.getMinistry() != null && s.getMinistry().toLowerCase().contains(q)) ||
                        (s.getCategory() != null && s.getCategory().toLowerCase().contains(q)) ||
                        (s.getState() != null && s.getState().toLowerCase().contains(q))
                    );
                }
                return match;
            })
            .limit(limit)
            .collect(Collectors.toList());
    }

    public List<Subsidy> findByStateAndIsActiveTrue(String state) {
        return subsidies.stream()
            .filter(s -> s.isActive() && state.equalsIgnoreCase(s.getState()))
            .collect(Collectors.toList());
    }

    public List<Subsidy> findByCategoryAndIsActiveTrue(String category) {
        return subsidies.stream()
            .filter(s -> s.isActive() && category.equalsIgnoreCase(s.getCategory()))
            .collect(Collectors.toList());
    }

    public List<Subsidy> findByStateAndCategoryAndIsActiveTrue(String state, String category) {
        return subsidies.stream()
            .filter(s -> s.isActive() && state.equalsIgnoreCase(s.getState()) && category.equalsIgnoreCase(s.getCategory()))
            .collect(Collectors.toList());
    }

    public boolean existsByTitle(String title) {
        return subsidies.stream().anyMatch(s -> title.equalsIgnoreCase(s.getTitle()));
    }

    // ─── Stats / Analytics ─────────────────────────────────────────────────────

    /** Returns scheme count grouped by state (active schemes only). */
    public Map<String, Long> countByState() {
        return subsidies.stream()
            .filter(Subsidy::isActive)
            .filter(s -> s.getState() != null && !s.getState().isEmpty())
            .collect(Collectors.groupingBy(Subsidy::getState, Collectors.counting()));
    }

    /** Returns scheme count grouped by category (active schemes only). */
    public Map<String, Long> countByCategory() {
        return subsidies.stream()
            .filter(Subsidy::isActive)
            .filter(s -> s.getCategory() != null && !s.getCategory().isEmpty())
            .collect(Collectors.groupingBy(Subsidy::getCategory, Collectors.counting()));
    }

    /** Returns scheme count grouped by ministry (active schemes only). */
    public Map<String, Long> countByMinistry() {
        return subsidies.stream()
            .filter(Subsidy::isActive)
            .filter(s -> s.getMinistry() != null && !s.getMinistry().isEmpty())
            .collect(Collectors.groupingBy(Subsidy::getMinistry, Collectors.counting()));
    }
}
