package com.government.infosys.repository;

import com.government.infosys.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserJpaRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByAadharNumber(String aadharNumber);

    boolean existsByEmail(String email);

    boolean existsByAadharNumber(String aadharNumber);
}