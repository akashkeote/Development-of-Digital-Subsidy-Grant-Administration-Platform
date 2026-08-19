package com.government.infosys.repository;

import com.government.infosys.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApplicationJpaRepository extends JpaRepository<Application, Long> {

    List<Application> findByCitizenId(Long citizenId);

    List<Application> findBySchemeId(Long schemeId);

    List<Application> findByCurrentStatusId(Long statusId);

    List<Application> findByApprovalStatusId(Long statusId);

    Optional<Application> findByCitizen_User_AadharNumber(String aadharNumber);
}