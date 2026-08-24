package com.government.infosys.repository;
import com.government.infosys.entity.EligibilityScoreLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface EligibilityScoreLogRepository extends JpaRepository<EligibilityScoreLog, Long> {
    List<EligibilityScoreLog> findByApplicationId(Long applicationId);
}
