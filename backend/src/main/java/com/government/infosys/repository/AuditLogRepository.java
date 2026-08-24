package com.government.infosys.repository;
import com.government.infosys.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {}
