package com.government.infosys.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "status_types")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StatusType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "is_active")
    private Boolean isActive;

}