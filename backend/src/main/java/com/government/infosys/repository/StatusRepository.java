package com.government.infosys.repository;

import com.government.infosys.entity.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface StatusRepository extends JpaRepository<Status, Long> {

    Optional<Status> findByCode(String code);

    @Query("""
        SELECT s
        FROM Status s
        JOIN s.statusType st
        WHERE s.code = :statusCode
          AND st.code = :statusTypeCode
    """)
    Optional<Status> findStatus(
            @Param("statusCode") String statusCode,
            @Param("statusTypeCode") String statusTypeCode
    );
}