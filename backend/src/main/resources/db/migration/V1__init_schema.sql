-- =============================================================================
-- Flyway Migration: V1__init_schema.sql
-- Description: Khởi tạo 20 bảng CSDL PostgreSQL 16 theo ERD 2.3.0
-- Standards: Tinh giản Index thủ công, Bảo vệ Soft Delete (RESTRICT dữ liệu chính & CASCADE dữ liệu tạm/trung gian)
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- Helper Function & Trigger: Auto-update updated_at timestamp
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- 1. PHÂN HỆ AUTHENTICATION, IDENTITY & PERMISSIONS

-- 1.1 USERS
CREATE TABLE users (
                       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                       email VARCHAR(255) NOT NULL UNIQUE,
                       phone_number VARCHAR(20) NOT NULL UNIQUE,
                       password_hash VARCHAR(255) NOT NULL,
                       status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
                       created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 1.2 ROLES
CREATE TABLE roles (
                       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                       role_code VARCHAR(50) NOT NULL UNIQUE,
                       role_name VARCHAR(100) NOT NULL
);

-- 1.3 PERMISSIONS
CREATE TABLE permissions (
                             id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                             permission_code VARCHAR(100) NOT NULL UNIQUE,
                             permission_name VARCHAR(150) NOT NULL
);

-- 1.4 USER_ROLES (Giữ CASCADE cho bảng trung gian N-N)
CREATE TABLE user_roles (
                            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                            role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
                            PRIMARY KEY (user_id, role_id)
);

-- 1.5 ROLE_PERMISSIONS (Giữ CASCADE cho bảng trung gian N-N)
CREATE TABLE role_permissions (
                                  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
                                  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
                                  PRIMARY KEY (role_id, permission_id)
);

-- 1.6 REFRESH_TOKENS (Giữ CASCADE cho dữ liệu phiên làm việc)
CREATE TABLE refresh_tokens (
                                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                token_hash VARCHAR(255) NOT NULL UNIQUE,
                                device_info VARCHAR(255),
                                ip_address VARCHAR(45),
                                is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
                                last_used_at TIMESTAMP WITH TIME ZONE,
                                expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
                                created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 1.7 OTP_CODES (Giữ CASCADE cho dữ liệu mã xác thực tạm thời)
CREATE TABLE otp_codes (
                           id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                           user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                           purpose VARCHAR(50) NOT NULL,
                           code_hash VARCHAR(255) NOT NULL,
                           attempt_count INT NOT NULL DEFAULT 0,
                           max_attempts INT NOT NULL DEFAULT 3,
                           is_used BOOLEAN NOT NULL DEFAULT FALSE,
                           expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
                           created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 2. PHÂN HỆ TỔ CHỨC, KHÁCH HÀNG & NHÂN VIÊN
-- =============================================================================

-- 2.1 BRANCHES
CREATE TABLE branches (
                          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                          branch_code VARCHAR(20) NOT NULL UNIQUE,
                          branch_name VARCHAR(150) NOT NULL,
                          address VARCHAR(255) NOT NULL,
                          city VARCHAR(100) NOT NULL,
                          phone_number VARCHAR(20),
                          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2.2 CUSTOMERS (Dùng RESTRICT bảo vệ Soft Delete)
CREATE TABLE customers (
                           id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                           user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE RESTRICT,
                           customer_code VARCHAR(20) NOT NULL UNIQUE,
                           full_name VARCHAR(150) NOT NULL,
                           national_id VARCHAR(20) NOT NULL UNIQUE,
                           date_of_birth DATE,
                           address VARCHAR(255),
                           avatar_url VARCHAR(500),
                           created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 2.3 EMPLOYEES (Dùng RESTRICT bảo vệ Soft Delete)
CREATE TABLE employees (
                           id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                           user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE RESTRICT,
                           employee_code VARCHAR(20) NOT NULL UNIQUE,
                           full_name VARCHAR(150) NOT NULL,
                           branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
                           department VARCHAR(100),
                           hire_date DATE,
                           created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_employees_updated_at
    BEFORE UPDATE ON employees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 2.4 KYC_DOCUMENTS (Dùng RESTRICT bảo vệ Soft Delete)
CREATE TABLE kyc_documents (
                               id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                               customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
                               front_id_card_url VARCHAR(500) NOT NULL,
                               back_id_card_url VARCHAR(500) NOT NULL,
                               selfie_photo_url VARCHAR(500) NOT NULL,
                               status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
                               verified_by_employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
                               rejection_reason VARCHAR(255),
                               submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                               verified_at TIMESTAMP WITH TIME ZONE
);

-- 2.5 BENEFICIARIES (Dùng RESTRICT bảo vệ Soft Delete)
CREATE TABLE beneficiaries (
                               id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                               customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
                               beneficiary_name VARCHAR(150) NOT NULL,
                               account_number VARCHAR(30) NOT NULL,
                               bank_code VARCHAR(20) NOT NULL,
                               alias_name VARCHAR(100),
                               created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                               updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_beneficiaries_updated_at
    BEFORE UPDATE ON beneficiaries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- 3. PHÂN HỆ CORE BANKING (ACCOUNTS, CARDS, SAVINGS)
-- =============================================================================

-- 3.1 ACCOUNTS
CREATE TABLE accounts (
                          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                          account_number VARCHAR(30) NOT NULL UNIQUE,
                          customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
                          balance NUMERIC(18, 2) NOT NULL DEFAULT 0.00,
                          frozen_balance NUMERIC(18, 2) NOT NULL DEFAULT 0.00,
                          available_balance NUMERIC(18, 2) GENERATED ALWAYS AS (balance - frozen_balance) STORED,
                          currency VARCHAR(3) NOT NULL DEFAULT 'VND',
                          account_type VARCHAR(20) NOT NULL DEFAULT 'CHECKING',
                          status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
                          opened_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          closed_at TIMESTAMP WITH TIME ZONE,
                          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_accounts_updated_at
    BEFORE UPDATE ON accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3.2 CARDS
CREATE TABLE cards (
                       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                       card_number_encrypted VARCHAR(255) NOT NULL UNIQUE,
                       masked_number VARCHAR(20) NOT NULL,
                       linked_account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
                       card_type VARCHAR(20) NOT NULL,
                       network VARCHAR(20) NOT NULL,
                       status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
                       expiry_month INT NOT NULL,
                       expiry_year INT NOT NULL,
                       cvv_hash VARCHAR(255) NOT NULL,
                       pin_hash VARCHAR(255),
                       is_online_enabled BOOLEAN NOT NULL DEFAULT TRUE,
                       is_international_enabled BOOLEAN NOT NULL DEFAULT FALSE,
                       daily_online_limit NUMERIC(18, 2) NOT NULL DEFAULT 50000000.00,
                       daily_atm_limit NUMERIC(18, 2) NOT NULL DEFAULT 20000000.00,
                       daily_pos_limit NUMERIC(18, 2) NOT NULL DEFAULT 50000000.00,
                       created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_cards_updated_at
    BEFORE UPDATE ON cards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3.3 CARD_TRANSACTIONS
CREATE TABLE card_transactions (
                                   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                   card_id UUID NOT NULL REFERENCES cards(id) ON DELETE RESTRICT,
                                   merchant_name VARCHAR(150) NOT NULL,
                                   merchant_category VARCHAR(50),
                                   amount NUMERIC(18, 2) NOT NULL,
                                   currency VARCHAR(3) NOT NULL DEFAULT 'VND',
                                   status VARCHAR(20) NOT NULL,
                                   transaction_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3.4 SAVINGS_ACCOUNTS
CREATE TABLE savings_accounts (
                                  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                  savings_code VARCHAR(30) NOT NULL UNIQUE,
                                  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
                                  source_account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
                                  principal_amount NUMERIC(18, 2) NOT NULL,
                                  interest_rate NUMERIC(5, 4) NOT NULL,
                                  term_months INT NOT NULL,
                                  expected_interest NUMERIC(18, 2) NOT NULL,
                                  auto_renewal_option VARCHAR(20) NOT NULL DEFAULT 'PRINCIPAL_AND_INTEREST',
                                  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
                                  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                  maturity_date TIMESTAMP WITH TIME ZONE NOT NULL,
                                  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_savings_updated_at
    BEFORE UPDATE ON savings_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- 4. PHÂN HỆ GIAO DỊCH, SỔ CÁI & TIỀN MẶT
-- =============================================================================

-- 4.1 TRANSACTIONS
CREATE TABLE transactions (
                              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                              transaction_code VARCHAR(50) NOT NULL UNIQUE,
                              source_account_id UUID REFERENCES accounts(id) ON DELETE RESTRICT,
                              target_account_id UUID REFERENCES accounts(id) ON DELETE RESTRICT,
                              target_bank_code VARCHAR(20),
                              target_bank_name VARCHAR(150),
                              target_account_number VARCHAR(30),
                              target_account_name VARCHAR(150),
                              amount NUMERIC(18, 2) NOT NULL,
                              fee_amount NUMERIC(18, 2) NOT NULL DEFAULT 0.00,
                              description VARCHAR(255),
                              transaction_type VARCHAR(30) NOT NULL,
                              status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
                              idempotency_key VARCHAR(100) UNIQUE,
                              completed_at TIMESTAMP WITH TIME ZONE,
                              created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4.2 LEDGER_ENTRIES (Ghi sổ cái kép - Double Entry)
CREATE TABLE ledger_entries (
                                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE RESTRICT,
                                account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
                                entry_type VARCHAR(10) NOT NULL, -- DEBIT / CREDIT
                                amount NUMERIC(18, 2) NOT NULL,
                                balance_after NUMERIC(18, 2) NOT NULL,
                                description VARCHAR(255),
                                sequence_number BIGSERIAL,
                                entry_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4.3 CASH_TRANSACTIONS (Giao dịch tại quầy)
CREATE TABLE cash_transactions (
                                   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                   reference_code VARCHAR(50) NOT NULL UNIQUE,
                                   account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
                                   teller_employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE RESTRICT,
                                   operation_type VARCHAR(20) NOT NULL, -- DEPOSIT / WITHDRAWAL
                                   amount NUMERIC(18, 2) NOT NULL,
                                   depositor_name VARCHAR(150),
                                   depositor_national_id VARCHAR(20),
                                   created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 5. PHÂN HỆ QUẢN TRỊ, THÔNG BÁO & AUDIT
-- =============================================================================

-- 5.1 NOTIFICATIONS (Dùng RESTRICT bảo vệ Soft Delete)
CREATE TABLE notifications (
                               id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                               customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
                               title VARCHAR(150) NOT NULL,
                               message TEXT NOT NULL,
                               notification_type VARCHAR(30) NOT NULL,
                               reference_type VARCHAR(50),
                               reference_id VARCHAR(100),
                               is_read BOOLEAN NOT NULL DEFAULT FALSE,
                               created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5.2 SYSTEM_CONFIGS
CREATE TABLE system_configs (
                                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                config_key VARCHAR(100) NOT NULL UNIQUE,
                                config_value TEXT NOT NULL,
                                description VARCHAR(255),
                                updated_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
                                updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_system_configs_updated_at
    BEFORE UPDATE ON system_configs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5.3 AUDIT_LOGS
CREATE TABLE audit_logs (
                            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                            actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
                            actor_role VARCHAR(50),
                            action_code VARCHAR(100) NOT NULL,
                            entity_name VARCHAR(100),
                            entity_id VARCHAR(100),
                            is_success BOOLEAN NOT NULL DEFAULT TRUE,
                            ip_address VARCHAR(45),
                            user_agent VARCHAR(255),
                            metadata JSONB,
                            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);