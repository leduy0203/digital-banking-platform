package com.digitalbanking.repository.dao;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowCallbackHandler;
import org.springframework.stereotype.Repository;

import java.time.Instant;

@Repository
@RequiredArgsConstructor
@Slf4j(topic = "STATEMENT_REPOSITORY")
public class StatementJdbcRepository {

    private final JdbcTemplate jdbcTemplate;

    /**
     * [STATEMENT EXPORT] Stream dữ liệu sao kê tài khoản ra file CSV / Excel / PDF
     * Sử dụng RowCallbackHandler để đọc từng dòng và ghi trực tiếp ra OutputStream
     * Giúp hệ thống không bị tràn RAM (OutOfMemory) khi sao kê có hàng vạn giao dịch.
     *
     * @param accountNumber Số tài khoản cần trích xuất
     * @param fromDate      Từ ngày
     * @param toDate        Đến ngày
     * @param handler       RowCallbackHandler xử lý từng dòng dữ liệu
     */
    // public void streamStatement(String accountNumber, Instant fromDate, Instant toDate, RowCallbackHandler handler) {}
}

