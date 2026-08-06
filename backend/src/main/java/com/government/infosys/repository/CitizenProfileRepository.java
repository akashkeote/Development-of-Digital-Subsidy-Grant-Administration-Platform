package com.government.infosys.repository;

import com.government.infosys.entity.CitizenProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CitizenProfileRepository extends JpaRepository<CitizenProfile, Long> {
}