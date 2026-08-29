package com.government.infosys.repository;

import com.government.infosys.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    boolean existsByReferenceTypeAndReferenceIdAndCreatedAtBetween(
            String referenceType,
            Long referenceId,
            LocalDateTime start,
            LocalDateTime end
    );
}