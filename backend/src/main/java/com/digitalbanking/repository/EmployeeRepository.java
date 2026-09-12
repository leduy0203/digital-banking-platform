package com.digitalbanking.repository;

import com.digitalbanking.domain.entity.EmployeeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface EmployeeRepository extends JpaRepository<EmployeeEntity, UUID> ,
        JpaSpecificationExecutor<EmployeeEntity> {

    Optional<EmployeeEntity> findByUserId(UUID id);

    boolean existsByEmployeeCode(String employeeCode);
}
