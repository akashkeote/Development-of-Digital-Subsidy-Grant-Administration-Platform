import os

base_dir = "src/main/java/com/government/infosys"
entity_dir = os.path.join(base_dir, "entity")
repo_dir = os.path.join(base_dir, "repository")
service_dir = os.path.join(base_dir, "service")
controller_dir = os.path.join(base_dir, "controller")
security_dir = os.path.join(base_dir, "security")
scheduler_dir = os.path.join(base_dir, "scheduler")

os.makedirs(entity_dir, exist_ok=True)
os.makedirs(repo_dir, exist_ok=True)
os.makedirs(service_dir, exist_ok=True)
os.makedirs(controller_dir, exist_ok=True)
os.makedirs(security_dir, exist_ok=True)
os.makedirs(scheduler_dir, exist_ok=True)

files = {}

files[os.path.join(entity_dir, "Scheme.java")] = '''package com.government.infosys.entity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "schemes")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Scheme {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "department_id")
    private Department department;
    @Column(nullable = false, unique = true, length = 50)
    private String code;
    @Column(nullable = false, length = 200)
    private String name;
    @Column(columnDefinition = "TEXT")
    private String description;
    @Column(name = "max_amount")
    private BigDecimal maxAmount;
    @Column(name = "installment_rule_json", columnDefinition = "JSON")
    private String installmentRuleJson;
    @Column(name = "start_date")
    private LocalDate startDate;
    @Column(name = "end_date")
    private LocalDate endDate;
    @Column(name = "total_budget")
    private BigDecimal totalBudget;
    @Column(name = "budget_used")
    private BigDecimal budgetUsed = BigDecimal.ZERO;
    @Column(name = "is_active")
    private Boolean isActive = true;
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        if (createdAt == null) createdAt = now;
        if (updatedAt == null) updatedAt = now;
        if (budgetUsed == null) budgetUsed = BigDecimal.ZERO;
    }
    @PreUpdate protected void onUpdate() { updatedAt = LocalDateTime.now(); }
}
'''

files[os.path.join(entity_dir, "EligibilityRule.java")] = '''package com.government.infosys.entity;
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
'''

files[os.path.join(entity_dir, "EligibilityScoreLog.java")] = '''package com.government.infosys.entity;
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
'''

files[os.path.join(entity_dir, "VerificationWorkflow.java")] = '''package com.government.infosys.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
@Entity
@Table(name = "verification_workflow")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class VerificationWorkflow {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "application_id", nullable = false)
    private Application application;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "assigned_to")
    private User assignedTo;
    private String stage; // FIELD_OFFICER, DISTRICT_OFFICER, FINANCE_APPROVER
    private String actionTaken; // APPROVE, REJECT, ESCALATE, RE_VERIFY
    private String comments;
    private LocalDateTime timestamp;
}
'''

files[os.path.join(entity_dir, "DisbursementPlan.java")] = '''package com.government.infosys.entity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
@Entity
@Table(name = "disbursement_plan")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DisbursementPlan {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "application_id", nullable = false)
    private Application application;
    private BigDecimal totalAmount;
    private Integer totalStages;
    private LocalDateTime createdAt;
    @OneToMany(mappedBy = "plan", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<DisbursementMilestone> milestones;
}
'''

files[os.path.join(entity_dir, "DisbursementMilestone.java")] = '''package com.government.infosys.entity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
@Entity
@Table(name = "disbursement_milestone")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DisbursementMilestone {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "plan_id", nullable = false)
    private DisbursementPlan plan;
    private Integer stageNumber;
    private String milestoneName;
    private BigDecimal amountToRelease;
    private LocalDate dueDate;
    private String completionStatus; // PENDING, COMPLETED, RELEASED, OVERDUE
    private LocalDateTime completedDate;
    private BigDecimal amountReleased;
    private LocalDateTime releaseDate;
}
'''

files[os.path.join(entity_dir, "Notification.java")] = '''package com.government.infosys.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
@Entity
@Table(name = "notifications")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Notification {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id", nullable = false)
    private User user;
    private String message;
    private Boolean isRead;
    private LocalDateTime createdAt;
}
'''

files[os.path.join(entity_dir, "AuditLog.java")] = '''package com.government.infosys.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
@Entity
@Table(name = "audit_log")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AuditLog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String action;
    private String entity;
    private Long entityId;
    private String oldStatus;
    private String newStatus;
    private LocalDateTime timestamp;
}
'''

files[os.path.join(repo_dir, "SchemeRepository.java")] = '''package com.government.infosys.repository;
import com.government.infosys.entity.Scheme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
@Repository
public interface SchemeRepository extends JpaRepository<Scheme, Long> {
    Optional<Scheme> findByCode(String code);
}
'''

files[os.path.join(repo_dir, "EligibilityRuleRepository.java")] = '''package com.government.infosys.repository;
import com.government.infosys.entity.EligibilityRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
@Repository
public interface EligibilityRuleRepository extends JpaRepository<EligibilityRule, Long> {
    Optional<EligibilityRule> findBySchemeId(Long schemeId);
}
'''

files[os.path.join(repo_dir, "EligibilityScoreLogRepository.java")] = '''package com.government.infosys.repository;
import com.government.infosys.entity.EligibilityScoreLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface EligibilityScoreLogRepository extends JpaRepository<EligibilityScoreLog, Long> {
    List<EligibilityScoreLog> findByApplicationId(Long applicationId);
}
'''

files[os.path.join(repo_dir, "VerificationWorkflowRepository.java")] = '''package com.government.infosys.repository;
import com.government.infosys.entity.VerificationWorkflow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface VerificationWorkflowRepository extends JpaRepository<VerificationWorkflow, Long> {
    List<VerificationWorkflow> findByApplicationId(Long applicationId);
}
'''

files[os.path.join(repo_dir, "DisbursementPlanRepository.java")] = '''package com.government.infosys.repository;
import com.government.infosys.entity.DisbursementPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
@Repository
public interface DisbursementPlanRepository extends JpaRepository<DisbursementPlan, Long> {
    Optional<DisbursementPlan> findByApplicationId(Long applicationId);
}
'''

files[os.path.join(repo_dir, "DisbursementMilestoneRepository.java")] = '''package com.government.infosys.repository;
import com.government.infosys.entity.DisbursementMilestone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
@Repository
public interface DisbursementMilestoneRepository extends JpaRepository<DisbursementMilestone, Long> {
    List<DisbursementMilestone> findByPlanIdOrderByStageNumberAsc(Long planId);
    
    @Query("SELECT m FROM DisbursementMilestone m WHERE m.completionStatus = 'PENDING' AND m.dueDate BETWEEN :startDate AND :endDate")
    List<DisbursementMilestone> findPendingMilestonesDueBetween(LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT m FROM DisbursementMilestone m WHERE m.completionStatus = 'PENDING' AND m.dueDate < :date")
    List<DisbursementMilestone> findPendingMilestonesPastDue(LocalDate date);
    
    List<DisbursementMilestone> findByCompletionStatus(String status);
}
'''

files[os.path.join(repo_dir, "NotificationRepository.java")] = '''package com.government.infosys.repository;
import com.government.infosys.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {}
'''

files[os.path.join(repo_dir, "AuditLogRepository.java")] = '''package com.government.infosys.repository;
import com.government.infosys.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {}
'''

for path, content in files.items():
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

print("Java Entities and Repositories generated.")
