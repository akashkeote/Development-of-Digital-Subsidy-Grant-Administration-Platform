package com.government.infosys.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class Subsidy {

    private String id;
    
    private String title;

    private String description;

    private Double amount;

    private String eligibilityCriteria;

    private String applicationDeadline;

    private String startDate;
    
    private String state;
    
    private String category;

    private boolean isActive = true;

    private boolean isExpired = false;

    private String applicationUrl;

    private String ministry;

    // Changed from String to List<String> to match the enriched JSON format
    private List<String> documentsRequired;

    private String benefits;

    private String applicationProcess;

    // ─── New fields required by project mentor ───────────────────────────────
    private String incomeLimit;

    private String grantAmount;

    private String schemeStatus;
}
