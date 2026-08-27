package com.government.infosys.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "eligibility_criteria_master")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EligibilityCriteriaMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "data_type", nullable = false, length = 20)
    private String dataType;

    @Column(length = 30)
    private String unit;

    @Column(length = 500)
    private String description;

    @Column(name = "is_active")
    private Boolean active;

}