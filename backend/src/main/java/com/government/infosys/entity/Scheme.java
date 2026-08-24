package com.government.infosys.entity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "schemes")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Scheme {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "department_id")
    private Department department;
    @Column(nullable = false, unique = true, length = 50)
    private String code;
    @Column(nullable = false, length = 200)
    private String name;
    @Column(columnDefinition = "TEXT")
    private String description;
    @Column(name = "max_amount")
    private BigDecimal maxAmount;
    @Column(name = "installment_rule_json", columnDefinition = "JSON")
    private String installmentRuleJson;
    @Column(name = "start_date")
    private LocalDate startDate;
    @Column(name = "end_date")
    private LocalDate endDate;
    @Column(name = "total_budget")
    private BigDecimal totalBudget;
    @Column(name = "budget_used")
    private BigDecimal budgetUsed = BigDecimal.ZERO;
    @Column(name = "is_active")
    private Boolean isActive = true;
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        if (createdAt == null) createdAt = now;
        if (updatedAt == null) updatedAt = now;
        if (budgetUsed == null) budgetUsed = BigDecimal.ZERO;
    }
    @PreUpdate protected void onUpdate() { updatedAt = LocalDateTime.now(); }
}
