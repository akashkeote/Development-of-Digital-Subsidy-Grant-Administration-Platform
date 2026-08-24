package com.government.infosys.entity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
@Entity
@Table(name = "eligibility_rules")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class EligibilityRule {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "scheme_id", nullable = false)
    private Scheme scheme;
    private String categoryMatch;
    private BigDecimal maxIncome;
    private Integer docsRequired;
    private Integer incomeWeight;
    private Integer categoryWeight;
    private Integer docsWeight;
    private Integer passingScore;
}
