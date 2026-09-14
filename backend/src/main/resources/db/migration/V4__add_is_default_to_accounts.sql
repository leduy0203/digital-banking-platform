-- =============================================================================
-- Flyway Migration: V4__add_is_default_to_accounts.sql
-- Description: Thêm cột is_default vào bảng accounts để quản lý tài khoản thanh toán chính
-- =============================================================================

-- 1. Thêm cột is_default kiểu boolean, mặc định là false
ALTER TABLE accounts 
    ADD COLUMN IF NOT EXISTS is_default BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. Tự động đánh dấu tài khoản CHECKING mở sớm nhất của mỗi khách hàng làm tài khoản mặc định (is_default = true)
WITH ranked_accounts AS (
    SELECT id,
           ROW_NUMBER() OVER(PARTITION BY customer_id ORDER BY opened_at ASC) as rn
    FROM accounts
    WHERE account_type = 'CHECKING'
)
UPDATE accounts a
SET is_default = TRUE
FROM ranked_accounts r
WHERE a.id = r.id AND r.rn = 1;

-- 3. Tạo index để tối ưu hóa truy vấn tìm tài khoản mặc định theo customer
CREATE INDEX IF NOT EXISTS idx_accounts_customer_default ON accounts(customer_id, is_default);
