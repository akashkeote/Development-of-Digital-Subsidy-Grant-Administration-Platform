package com.government.infosys.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "disbursements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Disbursement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sanction_order_id", nullable = false)
    private SanctionOrder sanctionOrder;

    @Column(name = "disbursed_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal disbursedAmount;

    @Column(name = "transaction_reference", nullable = false, unique = true)
    private String transactionReference;

    @Column(name = "payment_status", nullable = false, length = 30)
    private String paymentStatus;

    @Column(name = "released_by_user_id", nullable = false)
    private Long releasedByUserId;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "disbursed_at")
    private LocalDateTime disbursedAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {

        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }

        if (disbursedAt == null) {
            disbursedAt = LocalDateTime.now();
        }
    }
}