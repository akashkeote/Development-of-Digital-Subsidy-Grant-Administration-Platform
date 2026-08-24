package com.government.infosys.entity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
@Entity
@Table(name = "disbursement_plan")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DisbursementPlan {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "application_id", nullable = false)
    private Application application;
    private BigDecimal totalAmount;
    private Integer totalStages;
    private LocalDateTime createdAt;
    @OneToMany(mappedBy = "plan", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<DisbursementMilestone> milestones;
}
