package com.government.infosys.repository;

import com.government.infosys.entity.UserRoleAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRoleAssignmentRepository extends JpaRepository<UserRoleAssignment, Long> {
}