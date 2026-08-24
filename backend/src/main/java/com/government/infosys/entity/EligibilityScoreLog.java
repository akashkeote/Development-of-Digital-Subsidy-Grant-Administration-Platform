package com.government.infosys.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
@Entity
@Table(name = "eligibility_score_log")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class EligibilityScoreLog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "application_id", nullable = false)
    private Application application;
    private String criterion;
    private Integer weight;
    private Integer scoreObtained;
    private LocalDateTime calculatedAt;
}
