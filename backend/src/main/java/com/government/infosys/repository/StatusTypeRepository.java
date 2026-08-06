package com.government.infosys.repository;

import com.government.infosys.entity.StatusType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StatusTypeRepository extends JpaRepository<StatusType, Long> {

    Optional<StatusType> findByCode(String code);

}