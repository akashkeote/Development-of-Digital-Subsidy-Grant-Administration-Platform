package com.government.infosys.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "statuses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Status {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "status_type_id", nullable = false)
    private StatusType statusType;

    @Column(nullable = false, length = 50)
    private String code;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "display_order")
    private Integer displayOrder;

    @Column(name = "is_terminal")
    private Boolean isTerminal;

    @Column(name = "is_active")
    private Boolean isActive;

}