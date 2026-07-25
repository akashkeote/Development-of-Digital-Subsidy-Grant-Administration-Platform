package com.government.infosys.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

/**
 * User application for a government scheme.
 * Persisted to Supabase (PostgreSQL) via JPA.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
@Table(name = "applications")
public class Application {

    @Id
    private String id;

    @Column(name = "scheme_id", nullable = false)
    private String schemeId;

    @Column(name = "scheme_title")
    private String schemeTitle;

    @Column(name = "applicant_name")
    private String applicantName;

    @Column(name = "applicant_aadhar")
    private String applicantAadhar;

    @Column(name = "applicant_state")
    private String applicantState;

    @Column(name = "applicant_income")
    private String applicantIncome;

    @Column(name = "status")
    private String status;  // PENDING | APPROVED | REJECTED

    @Column(name = "submitted_at")
    private String submittedAt;
}
