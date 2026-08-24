package com.government.infosys.entity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
@Entity
@Table(name = "disbursement_milestone")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DisbursementMilestone {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "plan_id", nullable = false)
    private DisbursementPlan plan;
    private Integer stageNumber;
    private String milestoneName;
    private BigDecimal amountToRelease;
    private LocalDate dueDate;
    private String completionStatus; // PENDING, COMPLETED, RELEASED, OVERDUE
    private LocalDateTime completedDate;
    private BigDecimal amountReleased;
    private LocalDateTime releaseDate;
}
