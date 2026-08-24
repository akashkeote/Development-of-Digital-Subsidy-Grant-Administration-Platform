package com.government.infosys.service;
import com.government.infosys.entity.*;
import com.government.infosys.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
public class EligibilityScoringService {
    @Autowired private ApplicationRepository applicationRepository;
    @Autowired private EligibilityRuleRepository eligibilityRuleRepository;
    @Autowired private EligibilityScoreLogRepository scoreLogRepository;
    @Autowired private VerificationWorkflowRepository workflowRepository;
    @Autowired private StatusRepository statusRepository;

    @Transactional
    public Application processApplicationSubmission(Application app, CitizenProfile citizen) {
        EligibilityRule rule = eligibilityRuleRepository.findBySchemeId(app.getScheme().getId())
                .orElseThrow(() -> new RuntimeException("Eligibility rules not found for scheme"));

        int totalScore = 0;
        
        // 1. Income Check
        int incomeScore = 0;
        // mock logic for income vs maxIncome
        if (rule.getMaxIncome() != null) {
            incomeScore = rule.getIncomeWeight(); // assuming they pass
        }
        totalScore += incomeScore;
        saveLog(app, "Income Level", rule.getIncomeWeight(), incomeScore);

        // 2. Category Match
        int categoryScore = 0;
        if (rule.getCategoryMatch() == null || rule.getCategoryMatch().equals("ALL")) {
            categoryScore = rule.getCategoryWeight();
        }
        totalScore += categoryScore;
        saveLog(app, "Category Match", rule.getCategoryWeight(), categoryScore);

        // 3. Document Completeness
        int docsScore = rule.getDocsWeight(); // Assuming all docs uploaded for now
        totalScore += docsScore;
        saveLog(app, "Document Completeness", rule.getDocsWeight(), docsScore);

        Status newStatus;
        if (totalScore >= rule.getPassingScore()) {
            newStatus = statusRepository.findByCode("FIELD_OFFICER_PENDING").orElse(null);
            
            VerificationWorkflow workflow = VerificationWorkflow.builder()
                .application(app)
                .stage("FIELD_OFFICER")
                .actionTaken("ASSIGNED")
                .comments("Passed eligibility with score " + totalScore)
                .timestamp(LocalDateTime.now())
                .build();
            workflowRepository.save(workflow);
        } else {
            newStatus = statusRepository.findByCode("REJECTED").orElse(null);
        }
        
        if(newStatus != null) app.setCurrentStatus(newStatus);
        return applicationRepository.save(app);
    }

    private void saveLog(Application app, String criterion, int weight, int score) {
        EligibilityScoreLog log = EligibilityScoreLog.builder()
            .application(app).criterion(criterion).weight(weight).scoreObtained(score)
            .calculatedAt(LocalDateTime.now()).build();
        scoreLogRepository.save(log);
    }
}
