package com.example.backend.repositories;

import com.example.backend.models.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * JPA Repository backed by Supabase PostgreSQL.
 * Handles CRUD for user applications only.
 * Schemes are NOT stored here — they live in local JSON.
 */
@Repository
public interface ApplicationJpaRepository extends JpaRepository<Application, String> {
    List<Application> findByApplicantAadhar(String aadhar);
    List<Application> findBySchemeId(String schemeId);
    List<Application> findByStatus(String status);
}
