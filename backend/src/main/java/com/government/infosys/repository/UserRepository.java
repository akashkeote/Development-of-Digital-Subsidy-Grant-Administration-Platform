package com.government.infosys.repository;

import com.government.infosys.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserRepository {

    @Autowired
    private UserJpaRepository jpaRepository;

    public User save(User user) {
        return jpaRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return jpaRepository.findByEmail(email);
    }

    public boolean existsByEmail(String email) {
        return jpaRepository.existsByEmail(email);
    }

    public Optional<User> findByAadharNumber(String aadharNumber) {
        return jpaRepository.findByAadharNumber(aadharNumber);
    }

    public boolean existsByAadharNumber(String aadharNumber) {
        return jpaRepository.existsByAadharNumber(aadharNumber);
    }

    public Optional<User> findById(String id) {
        try {
            Long userId = Long.valueOf(id);
            return jpaRepository.findById(userId);
        } catch (NumberFormatException e) {
            return Optional.empty();
        }
    }

    public Optional<User> findById(Long id) {
        return jpaRepository.findById(id);
    }

    public boolean existsById(Long id) {
        return jpaRepository.existsById(id);
    }

    public void deleteById(Long id) {
        jpaRepository.deleteById(id);
    }
}
