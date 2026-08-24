package com.government.infosys.repository;
import com.government.infosys.entity.Scheme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
@Repository
public interface SchemeRepository extends JpaRepository<Scheme, Long> {
    Optional<Scheme> findByCode(String code);
}
