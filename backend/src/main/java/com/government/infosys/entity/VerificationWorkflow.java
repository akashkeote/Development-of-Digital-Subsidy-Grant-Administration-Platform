package com.government.infosys.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
@Entity
@Table(name = "verification_workflow")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class VerificationWorkflow {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "application_id", nullable = false)
    private Application application;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "assigned_to")
    private User assignedTo;
    private String stage; // FIELD_OFFICER, DISTRICT_OFFICER, FINANCE_APPROVER
    private String actionTaken; // APPROVE, REJECT, ESCALATE, RE_VERIFY
    private String comments;
    private LocalDateTime timestamp;
}
