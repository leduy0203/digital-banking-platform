package com.digitalbanking.repository;

import com.digitalbanking.domain.entity.CustomerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CustomerRepository extends JpaRepository<CustomerEntity, UUID> , JpaSpecificationExecutor<CustomerEntity> {

    Optional<CustomerEntity> findByCustomerCode(String customerCode);

    Optional<CustomerEntity> findByNationalId(String nationalId);

    Optional<CustomerEntity> findByUserId(UUID userId);

    boolean existsByNationalId(String nationalId);

    boolean existsByUserId(UUID userId);
}