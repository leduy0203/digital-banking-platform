package com.digitalbanking.repository.dao;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
@Slf4j(topic = "TRANSACTION_REPOSITORY")
public class TransactionJdbcRepository {

    private final JdbcTemplate jdbcTemplate;
}
