package com.digitalbanking.repository.dao;

import com.digitalbanking.domain.enums.TransactionStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.Instant;

@Repository
@RequiredArgsConstructor
@Slf4j(topic = "TRANSACTION_REPOSITORY")
public class TransactionJdbcRepository {

    private final JdbcTemplate jdbcTemplate;

    /**
     * [ATOMIC CLAIM] Atomically claims exclusive execution rights for a transaction.
     * Transitions status: PENDING -> PROCESSING
     *
     * @param transactionCode the transaction code (e.g. TXN...)
     * @return true if claimed successfully (affected rows == 1), false otherwise
     */
    public boolean markProcessing(String transactionCode) {
        String sql = """
                UPDATE transactions
                SET status = ?
                WHERE transaction_code = ?
                  AND status = ?
                """;
        int affected = jdbcTemplate.update(
                sql,
                TransactionStatus.PROCESSING.name(),
                transactionCode,
                TransactionStatus.PENDING.name()
        );
        return affected == 1;
    }

    /**
     * [MARK COMPLETED] Marks a transaction as successfully completed.
     * Transitions status: PROCESSING -> COMPLETED
     *
     * @param transactionCode the transaction code
     * @param completedAt     timestamp of completion
     * @return true if marked completed successfully, false otherwise
     */
    public boolean markCompleted(String transactionCode, Instant completedAt) {
        String sql = """
                UPDATE transactions
                SET status = ?,
                    completed_at = ?
                WHERE transaction_code = ?
                  AND status = ?
                """;
        int affected = jdbcTemplate.update(
                sql,
                TransactionStatus.COMPLETED.name(),
                completedAt,
                transactionCode,
                TransactionStatus.PROCESSING.name()
        );
        return affected == 1;
    }

    /**
     * [MARK FAILED] Marks a transaction as failed or expired.
     * Transitions status: PROCESSING -> FAILED
     *
     * @param transactionCode the transaction code
     * @param completedAt     timestamp of failure
     */
    public void markFailed(String transactionCode, Instant completedAt) {
        String sql = """
                UPDATE transactions
                SET status = ?,
                    completed_at = ?
                WHERE transaction_code = ?
                  AND status = ?
                """;
        jdbcTemplate.update(
                sql,
                TransactionStatus.FAILED.name(),
                completedAt,
                transactionCode,
                TransactionStatus.PROCESSING.name()
        );
    }
}

