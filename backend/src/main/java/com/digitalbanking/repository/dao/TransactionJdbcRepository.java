package com.digitalbanking.repository.dao;

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
     * [CORE TRANSFER] Cập nhật trạng thái giao dịch sang COMPLETED hoặc FAILED
     * Kèm thời gian completedAt và cập nhật updated_at = NOW()
     *
     * @param transactionCode Mã giao dịch (TXN...)
     * @param status          Trạng thái mới (COMPLETED / FAILED)
     * @param completedAt     Thời điểm hoàn tất
     * @return boolean true nếu cập nhật thành công
     */
    // public boolean updateTransactionStatus(String transactionCode, String status, Instant completedAt) {}

    /**
     * [TRANSACTION HISTORY] Tra cứu lịch sử giao dịch theo số tài khoản với bộ lọc linh hoạt (Dynamic SQL)
     * Lấy các giao dịch mà tài khoản là nguồn (tiền ra) HOẶC đích (tiền vào) và trạng thái là COMPLETED.
     *
     * @param accountNumber Số tài khoản cần xem
     * @param fromDate      Từ ngày (tùy chọn)
     * @param toDate        Đến ngày (tùy chọn)
     * @param type          Loại giao dịch TRANSFER, DEPOSIT, WITHDRAWAL (tùy chọn)
     * @param limit         Số bản ghi mỗi trang (Page size)
     * @param offset        Vị trí bắt đầu (Page index * size)
     */
    // public List<TransactionHistoryDto> findTransactionsWithFilter(String accountNumber, Instant fromDate, Instant toDate, String type, int limit, int offset) {}

    /**
     * [ADMIN REPORT] Thống kê tổng quan giao dịch (SUM, COUNT, GROUP BY theo ngày và loại giao dịch)
     *
     * @param fromDate Từ ngày
     * @param toDate   Đến ngày
     */
    // public List<TransactionStatisticsDto> getTransactionStatistics(Instant fromDate, Instant toDate) {}
}

