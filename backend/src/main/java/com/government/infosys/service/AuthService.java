package com.government.infosys.service;

import com.government.infosys.entity.Role;
import com.government.infosys.entity.User;
import com.government.infosys.repository.RoleRepository;
import com.government.infosys.repository.UserRepository;
import com.government.infosys.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
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

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

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
        // Store a BCrypt hash instead of the plain-text password
        user.setPassword(passwordEncoder.encode(password));
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

        if (!passwordEncoder.matches(password, user.getPassword())) {
            return Map.of(
                    "success", false,
                    "message", "Incorrect password."
            );
        }

        String role = user.getRole().getCode();
        // Generate JWT containing username and role
        String token = jwtUtil.generateToken(user.getEmail(), role);

        return Map.of(
                "success", true,
                "message", "Login successful!",
                "token", token,
                "user", Map.of(
                        "id", user.getId(),
                        "fullName", user.getFullName(),
                        "email", user.getEmail(),
                        "aadharNumber", user.getAadharNumber(),
                        "role", role
                )
        );
    }
}