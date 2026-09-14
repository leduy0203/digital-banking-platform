package com.digitalbanking.repository.dao;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
@RequiredArgsConstructor
@Slf4j(topic = "ACCOUNT-JDBC-REPOSITORY")
public class AccountJdbcRepository {

    private final JdbcTemplate jdbcTemplate;

    /**
     * [CORE TRANSFER] Khóa 2 tài khoản (Ordered Lock) để chống DEADLOCK khi 2 người cùng chuyển tiền qua lại tại một thời điểm.
     * Luôn sắp xếp thứ tự tài khoản theo alphabet trước khi thực hiện SELECT ... FOR UPDATE.
     *
     * @param acc1 Số tài khoản thứ nhất
     * @param acc2 Số tài khoản thứ hai
     */
    // public void lockAccountsForTransfer(String acc1, String acc2) {}

    /**
     * [CORE TRANSFER / WITHDRAWAL] Trừ tiền an toàn nguyên tử (Atomic Debit).
     * Kiểm tra điều kiện số dư khả dụng (balance - frozen_balance >= amount) và trạng thái ACTIVE ngay tại DB.
     *
     * @param accountNumber Số tài khoản cần trừ
     * @param amount        Số tiền cần trừ
     * @return boolean true nếu trừ thành công (affectedRows > 0), false nếu số dư không đủ hoặc tài khoản bị khóa
     */
    // public boolean debitBalance(String accountNumber, BigDecimal amount) {}

    /**
     * [CORE TRANSFER / DEPOSIT] Cộng tiền an toàn nguyên tử (Atomic Credit).
     *
     * @param accountNumber Số tài khoản người nhận
     * @param amount        Số tiền cộng vào
     * @return boolean true nếu cộng thành công
     */
    // public boolean creditBalance(String accountNumber, BigDecimal amount) {}

    /**
     * [BALANCE HOLD] Phong tỏa một phần số dư (Freeze / Hold balance).
     * Tăng frozen_balance với điều kiện khả dụng (balance - frozen_balance >= freezeAmount).
     *
     * @param accountNumber Số tài khoản cần phong tỏa
     * @param freezeAmount  Số tiền cần phong tỏa
     * @return boolean true nếu phong tỏa thành công
     */
    // public boolean freezeBalance(String accountNumber, BigDecimal freezeAmount) {}

    /**
     * [BALANCE HOLD] Giải tỏa số dư đã phong tỏa (Unfreeze / Release hold).
     * Giảm frozen_balance với điều kiện frozen_balance >= unfreezeAmount.
     *
     * @param accountNumber  Số tài khoản
     * @param unfreezeAmount Số tiền cần giải tỏa
     * @return boolean true nếu giải tỏa thành công
     */
    // public boolean unfreezeBalance(String accountNumber, BigDecimal unfreezeAmount) {}
}
