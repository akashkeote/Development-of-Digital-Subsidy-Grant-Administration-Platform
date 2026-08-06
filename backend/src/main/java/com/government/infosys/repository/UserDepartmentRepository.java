package com.government.infosys.repository;

import com.government.infosys.entity.UserDepartment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserDepartmentRepository extends JpaRepository<UserDepartment, Long> {
}