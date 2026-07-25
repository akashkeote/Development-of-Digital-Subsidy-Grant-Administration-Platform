package com.government.infosys.service;

import com.government.infosys.entity.Subsidy;
import com.government.infosys.repository.SubsidyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class SubsidyService {

    @Autowired
    private SubsidyRepository subsidyRepository;

    public List<Subsidy> getAllSubsidies() {
        return subsidyRepository.findAll();
    }

    public List<Subsidy> getSubsidies(String state, String category, String search, String ministry, int limit) {
        return subsidyRepository.findByIsActiveTrue(state, category, search, ministry, limit);
    }

    public Subsidy getSubsidyById(String id) throws Exception {
        Optional<Subsidy> subsidy = subsidyRepository.findById(id);
        if (subsidy.isPresent()) {
            return subsidy.get();
        } else {
            throw new Exception("Subsidy not found with id: " + id);
        }
    }

    public Subsidy saveSubsidy(Subsidy subsidy) {
        return subsidyRepository.save(subsidy);
    }

    public Subsidy updateSubsidy(String id, Subsidy updatedSubsidy) {
        return subsidyRepository.findById(id).map(subsidy -> {
            subsidy.setTitle(updatedSubsidy.getTitle());
            subsidy.setDescription(updatedSubsidy.getDescription());
            subsidy.setAmount(updatedSubsidy.getAmount());
            subsidy.setEligibilityCriteria(updatedSubsidy.getEligibilityCriteria());
            subsidy.setApplicationDeadline(updatedSubsidy.getApplicationDeadline());
            subsidy.setStartDate(updatedSubsidy.getStartDate());
            subsidy.setState(updatedSubsidy.getState());
            subsidy.setCategory(updatedSubsidy.getCategory());
            subsidy.setActive(updatedSubsidy.isActive());
            subsidy.setApplicationUrl(updatedSubsidy.getApplicationUrl());
            subsidy.setDocumentsRequired(updatedSubsidy.getDocumentsRequired());
            try {
                return subsidyRepository.save(subsidy);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }).orElseThrow(() -> new RuntimeException("Subsidy not found with id " + id));
    }

    /**
     * Returns aggregated stats: total schemes + breakdown by state, category, and ministry.
     * Used by the dashboard overview and for client reporting.
     */
    public Map<String, Object> getStats() {
        return Map.of(
            "totalSchemes", subsidyRepository.count(),
            "byState",    subsidyRepository.countByState(),
            "byCategory", subsidyRepository.countByCategory(),
            "byMinistry", subsidyRepository.countByMinistry()
        );
    }
}
