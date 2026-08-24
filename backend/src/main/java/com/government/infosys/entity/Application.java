package com.government.infosys.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "application_no", nullable = false, unique = true, length = 40)
    private String applicationNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "citizen_id", nullable = false)
    private CitizenProfile citizen;

    /*
     * The existing Subsidy class is still the JSON/in-memory scheme model.
     * We will introduce the JPA Scheme entity separately during scheme migration.
     *
     * For now this field maps directly to the database foreign key.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scheme_id", nullable = false)
    private Scheme scheme;

    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_stage_id")
    private WorkflowStage currentStage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_status_id", nullable = false)
    private Status currentStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approval_status_id", nullable = false)
    private Status approvalStatus;

    @Column(length = 500)
    private String remarks;

    @Column(length = 20)
    private String priority;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();

        if (submittedAt == null) {
            submittedAt = now;
        }

        if (createdAt == null) {
            createdAt = now;
        }

        if (updatedAt == null) {
            updatedAt = now;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}