package com.government.infosys.service;

import com.government.infosys.entity.Role;
import com.government.infosys.entity.User;
import com.government.infosys.repository.RoleRepository;
import com.government.infosys.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    public Map<String, Object> register(String fullName,
                                        String email,
                                        String password,
                                        String aadharNumber) {

        if (userRepository.existsByEmail(email)) {
            return Map.of(
                    "success", false,
                    "message", "Email already registered!"
            );
        }

        if (userRepository.existsByAadharNumber(aadharNumber)) {
            return Map.of(
                    "success", false,
                    "message", "Aadhaar number already registered!"
            );
        }

        Role citizenRole = roleRepository.findByCode("CITIZEN")
                .orElseThrow(() ->
                        new RuntimeException("Role CITIZEN not found in database"));

        User user = new User();

        user.setFullName(fullName);
        user.setEmail(email);
        user.setPassword(password); // TODO: Encode password later
        user.setAadharNumber(aadharNumber);
        user.setRole(citizenRole);
        user.setCreatedAt(LocalDateTime.now());

        userRepository.save(user);

        return Map.of(
                "success", true,
                "message", "Registration successful!",
                "user", Map.of(
                        "id", user.getId(),
                        "fullName", user.getFullName(),
                        "email", user.getEmail(),
                        "role", user.getRole().getCode()
                )
        );
    }

    public Map<String, Object> login(String email, String password) {

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return Map.of(
                    "success", false,
                    "message", "No account found with this email."
            );
        }

        User user = userOpt.get();

        if (!user.getPassword().equals(password)) {
            return Map.of(
                    "success", false,
                    "message", "Incorrect password."
            );
        }

        return Map.of(
                "success", true,
                "message", "Login successful!",
                "user", Map.of(
                        "id", user.getId(),
                        "fullName", user.getFullName(),
                        "email", user.getEmail(),
                        "aadharNumber", user.getAadharNumber(),
                        "role", user.getRole().getCode()
                )
        );
    }
}