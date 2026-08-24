package com.government.infosys.repository;
import com.government.infosys.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {}
