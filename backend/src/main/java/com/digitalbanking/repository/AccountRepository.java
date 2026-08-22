package com.digitalbanking.repository;

import com.digitalbanking.domain.enums.AccountStatus;
import com.digitalbanking.domain.entity.AccountEntity;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AccountRepository extends JpaRepository<AccountEntity, UUID> {

    Optional<AccountEntity> findByAccountNumber(String accountNumber);

    List<AccountEntity> findByCustomerIdAndStatus(UUID customerId, AccountStatus status);

    boolean existsByAccountNumber(String accountNumber);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT a FROM AccountEntity a WHERE a.accountNumber = :accountNumber")
    Optional<AccountEntity> findByAccountNumberForUpdate(@Param("accountNumber") String accountNumber);

}
