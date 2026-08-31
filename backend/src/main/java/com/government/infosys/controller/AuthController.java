package com.government.infosys.controller;

import com.government.infosys.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.government.infosys.repository.UserJpaRepository;
import java.util.List;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<com.government.infosys.entity.User> users = userJpaRepository.findAll();
        List<Map<String, Object>> response = new ArrayList<>();
        for (com.government.infosys.entity.User u : users) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", u.getId());
            map.put("username", u.getUsername());
            map.put("fullName", u.getFullName());
            map.put("email", u.getEmail());
            map.put("mobile", u.getMobile());
            map.put("aadharNumber", u.getAadharNumber());
            map.put("isActive", u.getIsActive());
            map.put("lastLoginAt", u.getLastLoginAt());
            if (u.getRole() != null) {
                map.put("role", Map.of("name", u.getRole().getName(), "code", u.getRole().getCode()));
            }
            response.add(map);
        }
        return ResponseEntity.ok(response);
    }


    @Autowired
    private AuthService authService;

    @Autowired
    private UserJpaRepository userJpaRepository;


    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> body) {
        try {
            String fullName = body.get("fullName");
            String email = body.get("email");
            String password = body.get("password");
            String aadharNumber = body.get("aadharNumber");
            String mobile = body.get("mobile");

            if (fullName == null || email == null || password == null
                    || aadharNumber == null || mobile == null) {

                return ResponseEntity.badRequest().body(
                        Map.of(
                                "success", false,
                                "message", "All fields are required."
                        )
                );
            }

            Map<String, Object> result = authService.register(fullName, email, password, aadharNumber,mobile);
            boolean success = (boolean) result.get("success");
            return success ? ResponseEntity.ok(result) : ResponseEntity.badRequest().body(result);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("success", false, "message", "Server error: " + e.getMessage()));
        }
    }

    @PostMapping("/admin/users")
    public ResponseEntity<Map<String, Object>> createUser(@RequestBody Map<String, String> body) {
        try {
            String fullName = body.get("fullName");
            String email = body.get("email");
            String password = body.get("password");
            String aadharNumber = body.get("aadharNumber");
            String mobile = body.get("mobile");
            String roleCode = body.get("roleCode");

            if (fullName == null || email == null || password == null || aadharNumber == null || mobile == null || roleCode == null) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "All fields are required."));
            }

            Map<String, Object> result = authService.createUserWithRole(fullName, email, password, aadharNumber, mobile, roleCode);
            boolean success = (boolean) result.get("success");
            return success ? ResponseEntity.ok(result) : ResponseEntity.badRequest().body(result);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("success", false, "message", "Server error: " + e.getMessage()));
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable Long id) {
        try {
            Map<String, Object> result = authService.deleteUser(id);
            boolean success = (boolean) result.get("success");
            return success ? ResponseEntity.ok(result) : ResponseEntity.badRequest().body(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("success", false, "message", "Server error: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            String password = body.get("password");

            if (email == null || password == null) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Email and password are required."));
            }

            Map<String, Object> result = authService.login(email, password);
            boolean success = (boolean) result.get("success");
            return success ? ResponseEntity.ok(result) : ResponseEntity.status(401).body(result);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("success", false, "message", "Server error: " + e.getMessage()));
        }
    }
}
