package com.government.infosys.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.government.infosys.entity.Department;
import com.government.infosys.entity.Scheme;
import com.government.infosys.repository.DepartmentRepository;
import com.government.infosys.repository.SchemeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class DataSeeder implements CommandLineRunner {

    private final SchemeRepository schemeRepository;
    private final DepartmentRepository departmentRepository;

    public DataSeeder(
            SchemeRepository schemeRepository,
            DepartmentRepository departmentRepository) {

        this.schemeRepository = schemeRepository;
        this.departmentRepository = departmentRepository;
    }

    @Override
    public void run(String... args) throws Exception {

        long existingCount = schemeRepository.count();

        System.out.println("==========================================================");
        System.out.println("Scheme Seeder");
        System.out.println("Existing schemes in database: " + existingCount);
        System.out.println("==========================================================");

        /*
         * If all schemes are already present, do nothing.
         */
        if (existingCount >= 4680) {

            System.out.println("All schemes are already present.");
            System.out.println("Skipping scheme seed.");

            return;
        }

        /*
         * Get default department inserted by Flyway V4.
         */
        Department defaultDepartment = departmentRepository
                .findByCode("SOC_WEL")
                .orElseThrow(() ->
                        new IllegalStateException(
                                "Department SOC_WEL was not found. " +
                                        "Make sure Flyway V4 has completed successfully."
                        )
                );

        /*
         * Load existing scheme codes.
         *
         * This makes the seeder RESUME-SAFE.
         */
        Set<String> existingCodes = new HashSet<>();

        schemeRepository.findAll()
                .forEach(scheme -> {
                    if (scheme.getCode() != null) {
                        existingCodes.add(scheme.getCode());
                    }
                });

        System.out.println(
                "Existing scheme codes loaded: "
                        + existingCodes.size()
        );

        ObjectMapper mapper = new ObjectMapper();

        List<Scheme> schemesToInsert = new ArrayList<>();

        try (
                InputStream inputStream =
                        new ClassPathResource("schemes_real.json")
                                .getInputStream()
        ) {

            JsonNode root = mapper.readTree(inputStream);

            if (!root.isArray()) {
                throw new IllegalStateException(
                        "schemes_real.json must contain a JSON array."
                );
            }

            System.out.println(
                    "JSON schemes found: "
                            + root.size()
            );

            /*
             * Convert JSON records to Scheme entities.
             */
            for (JsonNode node : root) {

                String jsonId = getText(node, "id");
                String title = getText(node, "title");

                /*
                 * Skip records without a title.
                 */
                if (title == null || title.isBlank()) {

                    System.out.println(
                            "WARNING: Skipping scheme with missing title. "
                                    + "JSON ID: "
                                    + jsonId
                    );

                    continue;
                }

                /*
                 * Generate database code.
                 */
                String code = createSchemeCode(
                        jsonId,
                        title
                );

                /*
                 * IMPORTANT:
                 *
                 * If this scheme already exists, skip it.
                 */
                if (existingCodes.contains(code)) {
                    continue;
                }

                Scheme scheme = new Scheme();

                scheme.setCode(code);
                scheme.setName(title);

                /*
                 * Description
                 */
                scheme.setDescription(
                        getText(node, "description")
                );

                /*
                 * Amount
                 */
                Double amount =
                        getNumber(node, "amount");

                if (amount != null && amount > 0) {

                    scheme.setMaxAmount(
                            BigDecimal.valueOf(amount)
                    );

                } else {

                    scheme.setMaxAmount(
                            BigDecimal.ZERO
                    );
                }

                /*
                 * START DATE
                 *
                 * Database currently requires this column
                 * to be NOT NULL.
                 */
                String startDateText =
                        getText(node, "startDate");

                LocalDate startDate =
                        parseDate(startDateText);

                if (startDate == null) {

                    System.out.println(
                            "WARNING: Missing or invalid startDate for "
                                    + jsonId
                                    + " - "
                                    + title
                                    + ". Using technical fallback 1900-01-01."
                    );

                    startDate =
                            LocalDate.of(1900, 1, 1);
                }

                scheme.setStartDate(startDate);

                /*
                 * END DATE
                 *
                 * applicationDeadline is allowed to be NULL.
                 */
                String endDateText =
                        getText(node, "applicationDeadline");

                scheme.setEndDate(
                        parseDate(endDateText)
                );

                /*
                 * Budget information is not supplied
                 * by the JSON dataset.
                 */
                scheme.setTotalBudget(
                        BigDecimal.ZERO
                );

                scheme.setBudgetUsed(
                        BigDecimal.ZERO
                );

                /*
                 * Active status.
                 */
                if (node.has("isActive")
                        && !node.get("isActive").isNull()) {

                    scheme.setIsActive(
                            node.get("isActive").asBoolean()
                    );

                } else {

                    scheme.setIsActive(true);
                }

                /*
                 * Department.
                 */
                scheme.setDepartment(
                        defaultDepartment
                );

                /*
                 * No installment rule in current JSON.
                 */
                scheme.setInstallmentRuleJson(null);

                schemesToInsert.add(scheme);

                /*
                 * Add immediately to the set so duplicate JSON
                 * records cannot be inserted during this run.
                 */
                existingCodes.add(code);
            }

            System.out.println("==========================================================");
            System.out.println(
                    "New schemes to insert: "
                            + schemesToInsert.size()
            );
            System.out.println("==========================================================");

            /*
             * Nothing to insert.
             */
            if (schemesToInsert.isEmpty()) {

                System.out.println(
                        "No new schemes found."
                );

                return;
            }

            /*
             * Small batches are safer for Supabase.
             *
             * Previous connection reset happened around
             * batch 5 when using 500 records.
             */
            int batchSize = 100;

            int total =
                    schemesToInsert.size();

            for (int i = 0; i < total; i += batchSize) {

                int end =
                        Math.min(
                                i + batchSize,
                                total
                        );

                List<Scheme> batch =
                        schemesToInsert.subList(
                                i,
                                end
                        );

                try {

                    schemeRepository.saveAll(batch);

                    schemeRepository.flush();

                    System.out.println(
                            "Seeded batch "
                                    + ((i / batchSize) + 1)
                                    + " ("
                                    + end
                                    + "/"
                                    + total
                                    + ")"
                    );

                } catch (Exception e) {

                    System.err.println(
                            "=========================================================="
                    );

                    System.err.println(
                            "ERROR while inserting batch "
                                    + ((i / batchSize) + 1)
                    );

                    System.err.println(
                            "Records "
                                    + (i + 1)
                                    + " to "
                                    + end
                    );

                    System.err.println(
                            "=========================================================="
                    );

                    throw e;
                }
            }

            long finalCount =
                    schemeRepository.count();

            System.out.println("==========================================================");
            System.out.println(
                    "Scheme seeding completed."
            );
            System.out.println(
                    "Database scheme count: "
                            + finalCount
            );
            System.out.println("==========================================================");
        }
    }

    /**
     * Safely read a JSON text field.
     */
    private static String getText(
            JsonNode node,
            String field
    ) {

        JsonNode value =
                node.get(field);

        if (value == null
                || value.isNull()) {

            return null;
        }

        String text =
                value.asText();

        if (text == null
                || text.isBlank()) {

            return null;
        }

        return text.trim();
    }

    /**
     * Safely read a JSON number.
     */
    private static Double getNumber(
            JsonNode node,
            String field
    ) {

        JsonNode value =
                node.get(field);

        if (value == null
                || value.isNull()) {

            return null;
        }

        if (!value.isNumber()) {

            return null;
        }

        return value.asDouble();
    }

    /**
     * Parse yyyy-MM-dd.
     */
    private static LocalDate parseDate(
            String value
    ) {

        if (value == null
                || value.isBlank()) {

            return null;
        }

        try {

            return LocalDate.parse(
                    value.trim()
            );

        } catch (Exception e) {

            return null;
        }
    }

    /**
     * Generate database-safe scheme code.
     *
     * Example:
     *
     * pmsby -> SCH_PMSBY
     * rgisfm -> SCH_RGISFM
     */
    private static String createSchemeCode(
            String jsonId,
            String title
    ) {

        String source;

        if (jsonId != null
                && !jsonId.isBlank()) {

            source = jsonId;

        } else {

            source = title;
        }

        String code =
                source
                        .toUpperCase()
                        .replaceAll(
                                "[^A-Z0-9]+",
                                "_"
                        )
                        .replaceAll(
                                "^_+",
                                ""
                        )
                        .replaceAll(
                                "_+$",
                                ""
                        );

        if (code.isBlank()) {
            code = "SCHEME";
        }

        /*
         * schemes.code is VARCHAR(50).
         *
         * SCH_ takes 4 characters.
         */
        if (code.length() > 46) {

            code =
                    code.substring(
                            0,
                            46
                    );
        }

        return "SCH_" + code;
    }
}