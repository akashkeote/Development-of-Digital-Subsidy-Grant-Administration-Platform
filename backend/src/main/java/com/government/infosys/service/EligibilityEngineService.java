package com.government.infosys.service;

import com.government.infosys.dto.EligibilityResult;
import com.government.infosys.entity.EligibilityCriteriaMaster;
import com.government.infosys.entity.SchemeEligibilityRule;
import com.government.infosys.repository.SchemeEligibilityRuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class EligibilityEngineService {

    @Autowired
    private SchemeEligibilityRuleRepository schemeEligibilityRuleRepository;

    /**
     * Evaluates applicant data against all eligibility rules
     * configured for a scheme.
     */
    public EligibilityResult evaluateEligibility(
            Long schemeId,
            Map<String, Object> applicantData) {

        List<SchemeEligibilityRule> rules =
                schemeEligibilityRuleRepository.findBySchemeId(schemeId);

        List<String> failedCriteria = new ArrayList<>();

        if (rules.isEmpty()) {
            return new EligibilityResult(
                    false,
                    "No eligibility rules configured for this scheme",
                    failedCriteria
            );
        }

        for (SchemeEligibilityRule rule : rules) {

            EligibilityCriteriaMaster criteria = rule.getCriteria();

            String criteriaCode = criteria.getCode();

            Object applicantValue =
                    applicantData.get(criteriaCode);

            boolean passed = evaluateRule(
                    applicantValue,
                    rule
            );

            if (!passed) {

                String failureMessage =
                        criteria.getName()
                                + " does not satisfy the scheme requirement";

                failedCriteria.add(failureMessage);
            }
        }

        if (failedCriteria.isEmpty()) {

            return new EligibilityResult(
                    true,
                    "Applicant satisfies all eligibility criteria",
                    failedCriteria
            );
        }

        return new EligibilityResult(
                false,
                "Applicant does not satisfy one or more eligibility criteria",
                failedCriteria
        );
    }

    /**
     * Evaluates one eligibility rule.
     */
    private boolean evaluateRule(
            Object applicantValue,
            SchemeEligibilityRule rule) {

        /*
         * If a value is mandatory but not supplied,
         * eligibility automatically fails.
         */
        if (applicantValue == null) {

            return !Boolean.TRUE.equals(
                    rule.getMandatory()
            );
        }

        String operator = rule.getOperator();

        String valueFrom = rule.getValueFrom();

        String valueTo = rule.getValueTo();

        try {

            switch (operator.toUpperCase()) {

                case "EQUALS":
                case "=":

                    return applicantValue
                            .toString()
                            .equalsIgnoreCase(valueFrom);

                case "NOT_EQUALS":
                case "!=":

                    return !applicantValue
                            .toString()
                            .equalsIgnoreCase(valueFrom);

                case "GREATER_THAN":
                case ">":

                    return Double.parseDouble(
                            applicantValue.toString()
                    ) > Double.parseDouble(valueFrom);

                case "GREATER_THAN_OR_EQUAL":
                case ">=":

                    return Double.parseDouble(
                            applicantValue.toString()
                    ) >= Double.parseDouble(valueFrom);

                case "LESS_THAN":
                case "<":

                    return Double.parseDouble(
                            applicantValue.toString()
                    ) < Double.parseDouble(valueFrom);

                case "LESS_THAN_OR_EQUAL":
                case "<=":

                    return Double.parseDouble(
                            applicantValue.toString()
                    ) <= Double.parseDouble(valueFrom);

                case "BETWEEN":

                    double value = Double.parseDouble(
                            applicantValue.toString()
                    );

                    double min = Double.parseDouble(valueFrom);

                    double max = Double.parseDouble(valueTo);

                    return value >= min && value <= max;

                case "IN":

                    String[] allowedValues =
                            valueFrom.split(",");

                    for (String allowedValue : allowedValues) {

                        if (applicantValue
                                .toString()
                                .trim()
                                .equalsIgnoreCase(
                                        allowedValue.trim()
                                )) {

                            return true;
                        }
                    }

                    return false;

                default:

                    return false;
            }

        } catch (Exception e) {

            return false;
        }
    }
}