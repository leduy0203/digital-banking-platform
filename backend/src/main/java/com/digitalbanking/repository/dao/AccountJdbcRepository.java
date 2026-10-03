package com.digitalbanking.repository.dao;

import com.digitalbanking.exception.BusinessException;
import com.digitalbanking.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
@RequiredArgsConstructor
@Slf4j(topic = "ACCOUNT-JDBC-REPOSITORY")
public class AccountJdbcRepository {

    private final JdbcTemplate jdbcTemplate;

    /**
     * [ORDERED LOCK] Locks source and target accounts in a deterministic order directly from DB.
     * Eliminates deadlock risks when two users concurrently transfer funds to each other.
     *
     * @param sourceAccountNumber the source account number
     * @param targetAccountNumber the target account number
     */
    public void lockAccountsForTransfer(String sourceAccountNumber, String targetAccountNumber) {
        String sql = """
                SELECT account_number
                FROM accounts
                WHERE account_number IN (?, ?)
                ORDER BY account_number
                FOR UPDATE
                """;

        jdbcTemplate.query(sql, rs -> {}, sourceAccountNumber, targetAccountNumber);
    }

    /**
     * [ATOMIC DEBIT] Atomically debits funds from the source account.
     * Ensures: status is ACTIVE and available balance (balance - frozen_balance) >= amount.
     *
     * @param accountNumber the account number to debit
     * @param amount        the amount to debit
     * @throws BusinessException with ErrorCode.INSUFFICIENT_FUNDS if conditions are not met
     */
    public BigDecimal debit(String accountNumber, BigDecimal amount) {
        String sql = """
                UPDATE accounts
                SET balance = balance - ?,
                    updated_at = NOW()
                WHERE account_number = ?
                  AND status = 'ACTIVE'
                  AND (balance - frozen_balance) >= ?
                RETURNING balance
                """;

        try {
            return jdbcTemplate.queryForObject(
                    sql,
                    BigDecimal.class,
                    amount,
                    accountNumber,
                    amount
            );
        } catch (EmptyResultDataAccessException e) {
            throw new BusinessException(ErrorCode.INSUFFICIENT_FUNDS);
        }
    }

    /**
     * [ATOMIC CREDIT] Atomically credits funds to the destination account.
     * Ensures: status is ACTIVE.
     *
     * @param accountNumber the destination account number to credit
     * @param amount        the amount to credit
     * @return updated balance after credit
     * @throws BusinessException with ErrorCode.ACCOUNT_LOCKED if target account is inactive or not found
     */
    public BigDecimal credit(String accountNumber, BigDecimal amount) {
        String sql = """
                UPDATE accounts
                SET balance = balance + ?,
                    updated_at = NOW()
                WHERE account_number = ?
                  AND status = 'ACTIVE'
                RETURNING balance
                """;

        try {
            return jdbcTemplate.queryForObject(
                    sql,
                    BigDecimal.class,
                    amount,
                    accountNumber
            );
        } catch (EmptyResultDataAccessException e) {
            throw new BusinessException(ErrorCode.ACCOUNT_LOCKED);
        }
    }

    /**
     * [GET BALANCE] Retrieves the current balance after mutation to record double-entry ledger entries.
     *
     * @param accountNumber the account number
     * @return current account balance
     */
    public BigDecimal getBalance(String accountNumber) {
        String sql = "SELECT balance FROM accounts WHERE account_number = ?";
        return jdbcTemplate.queryForObject(sql, BigDecimal.class, accountNumber);
    }
}