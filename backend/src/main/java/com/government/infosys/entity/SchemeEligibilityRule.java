package com.government.infosys.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "scheme_eligibility_rules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SchemeEligibilityRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "scheme_id", nullable = false)
    private Long schemeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "criteria_id", nullable = false)
    private EligibilityCriteriaMaster criteria;

    @Column(nullable = false, length = 20)
    private String operator;

    @Column(name = "value_from", length = 100)
    private String valueFrom;

    @Column(name = "value_to", length = 100)
    private String valueTo;

    @Column(name = "logical_group")
    private Integer logicalGroup;

    @Column(name = "logical_join", length = 10)
    private String logicalJoin;

    @Column(name = "is_mandatory")
    private Boolean mandatory;

}