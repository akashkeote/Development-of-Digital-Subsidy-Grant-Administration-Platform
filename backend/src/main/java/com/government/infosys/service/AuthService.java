package com.government.infosys.service;

import com.government.infosys.entity.Role;
import com.government.infosys.entity.User;
import com.government.infosys.repository.RoleRepository;
import com.government.infosys.repository.UserRepository;
import com.government.infosys.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.government.infosys.entity.CitizenProfile;
import com.government.infosys.repository.CitizenProfileRepository;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CitizenProfileRepository citizenProfileRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public Map<String, Object> register(String fullName,
                                        String email,
                                        String password,
                                        String aadharNumber,
                                        String mobile) {

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

        user.setUsername(email);
        user.setFullName(fullName);
        user.setEmail(email);
        String encodedPassword = passwordEncoder.encode(password);

        user.setPasswordHash(encodedPassword);
        user.setPassword(encodedPassword);
        user.setAadharNumber(aadharNumber);
        user.setMobile(mobile);
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

    
    public Map<String, Object> createUserWithRole(String fullName, String email, String password, String aadharNumber, String mobile, String roleCode) {
        if (userRepository.existsByEmail(email)) {
            return Map.of("success", false, "message", "Email already registered!");
        }
        if (userRepository.existsByAadharNumber(aadharNumber)) {
            return Map.of("success", false, "message", "Aadhaar number already registered!");
        }
        Role targetRole = roleRepository.findByCode(roleCode)
                .orElseThrow(() -> new RuntimeException("Role " + roleCode + " not found in database"));

        User user = new User();
        user.setUsername(email);
        user.setFullName(fullName);
        user.setEmail(email);
        String encodedPassword = passwordEncoder.encode(password);
        user.setPasswordHash(encodedPassword);
        user.setPassword(encodedPassword);
        user.setAadharNumber(aadharNumber);
        user.setMobile(mobile);
        user.setRole(targetRole);
        user.setCreatedAt(LocalDateTime.now());
        user.setIsActive(true);

        userRepository.save(user);

        return Map.of(
                "success", true,
                "message", "User created successfully with role " + roleCode,
                "user", Map.of("id", user.getId(), "email", user.getEmail(), "role", targetRole.getCode())
        );
    }

    public Map<String, Object> deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            return Map.of("success", false, "message", "User not found.");
        }
        userRepository.deleteById(id);
        return Map.of("success", true, "message", "User deleted successfully.");
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