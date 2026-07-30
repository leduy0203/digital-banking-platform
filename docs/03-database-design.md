# Thiết Kế Cơ Sở Dữ Liệu - Digital Banking Platform (Database Design Specification)

> **Phiên bản tài liệu**: 2.3.0 (**FROZEN - Production Ready for Spring Boot Backend**)  
> **Trạng thái**: Đã đóng băng Schema (Chính thức chuyển sang giai đoạn phát triển Backend Java)  
> **Hệ quản trị CSDL**: PostgreSQL 16 (JSONB & Native Enum Support)  
> **Quản lý Migration**: Flyway SQL Migration Scripts

---

## 1. Sơ Đồ ERD Cơ Sở Dữ Liệu Tổng Thể (Mermaid ERD)

```mermaid
erDiagram
    USERS ||--o| CUSTOMERS : "1-1 Hồ sơ khách hàng"
    USERS ||--o| EMPLOYEES : "1-1 Hồ sơ nhân viên"
    USERS ||--o{ REFRESH_TOKENS : "quản lý phiên JWT"
    USERS ||--o{ OTP_CODES : "quản lý mã OTP"
    USERS ||--o{ USER_ROLES : "gán vai trò"
    
    ROLES ||--o{ USER_ROLES : "chứa người dùng"
    ROLES ||--o{ ROLE_PERMISSIONS : "chứa quyền hạn"
    PERMISSIONS ||--o{ ROLE_PERMISSIONS : "thuộc vai trò"

    BRANCHES ||--o{ EMPLOYEES : "quản lý nhân viên chi nhánh"
    CUSTOMERS ||--o{ ACCOUNTS : "sở hữu tài khoản"
    CUSTOMERS ||--o{ BENEFICIARIES : "lưu sổ địa chỉ thụ hưởng"
    CUSTOMERS ||--o{ NOTIFICATIONS : "nhận thông báo"
    CUSTOMERS ||--o{ KYC_DOCUMENTS : "nộp eKYC"

    ACCOUNTS ||--o{ CARDS : "liên kết phát hành thẻ"
    ACCOUNTS ||--o{ SAVINGS_ACCOUNTS : "nguồn tiền tiết kiệm"
    ACCOUNTS ||--o{ TRANSACTIONS : "tài khoản nguồn/đích"
    ACCOUNTS ||--o{ CASH_TRANSACTIONS : "giao dịch tại quầy"

    CARDS ||--o{ CARD_TRANSACTIONS : "giao dịch quẹt thẻ/POS"
    TRANSACTIONS ||--o{ LEDGER_ENTRIES : "ghi sổ cái kép"
    EMPLOYEES ||--o{ KYC_DOCUMENTS : "phê duyệt eKYC"
    EMPLOYEES ||--o{ CASH_TRANSACTIONS : "thực hiện giao dịch tại quầy"
    USERS ||--o{ SYSTEM_CONFIGS : "quản trị chỉnh sửa tham số"

    USERS {
        uuid id PK
        string email UK
        string phone_number UK
        string password_hash
        string status
        timestamp created_at
        timestamp updated_at
    }

    CUSTOMERS {
        uuid id PK
        uuid user_id FK_UK
        string customer_code UK
        string full_name
        string national_id UK
        date date_of_birth
        string address
        string avatar_url
        timestamp created_at
        timestamp updated_at
    }

    BRANCHES {
        uuid id PK
        string branch_code UK
        string branch_name
        string address
        string city
        string phone_number
        timestamp created_at
    }

    EMPLOYEES {
        uuid id PK
        uuid user_id FK_UK
        string employee_code UK
        string full_name
        uuid branch_id FK
        string department
        date hire_date
        timestamp created_at
        timestamp updated_at
    }

    REFRESH_TOKENS {
        uuid id PK
        uuid user_id FK
        string token_hash UK
        string device_info
        string ip_address
        boolean is_revoked
        timestamp last_used_at
        timestamp expires_at
        timestamp created_at
    }

    OTP_CODES {
        uuid id PK
        uuid user_id FK
        string purpose
        string code_hash
        integer attempt_count
        integer max_attempts
        boolean is_used
        timestamp expires_at
        timestamp created_at
    }

    ROLES {
        uuid id PK
        string role_code UK
        string role_name
    }

    PERMISSIONS {
        uuid id PK
        string permission_code UK
        string permission_name
    }

    USER_ROLES {
        uuid user_id FK
        uuid role_id FK
    }

    ROLE_PERMISSIONS {
        uuid role_id FK
        uuid permission_id FK
    }

    ACCOUNTS {
        uuid id PK
        string account_number UK
        uuid customer_id FK
        decimal balance
        decimal frozen_balance
        decimal available_balance
        string currency
        string account_type
        string status
        timestamp opened_at
        timestamp closed_at
        timestamp created_at
        timestamp updated_at
    }

    CARDS {
        uuid id PK
        string card_number_encrypted UK
        string masked_number
        uuid linked_account_id FK
        string card_type
        string network
        string status
        integer expiry_month
        integer expiry_year
        string cvv_hash
        string pin_hash
        boolean is_online_enabled
        boolean is_international_enabled
        decimal daily_online_limit
        decimal daily_atm_limit
        decimal daily_pos_limit
        timestamp created_at
        timestamp updated_at
    }

    CARD_TRANSACTIONS {
        uuid id PK
        uuid card_id FK
        string merchant_name
        string merchant_category
        decimal amount
        string currency
        string status
        timestamp transaction_time
    }

    TRANSACTIONS {
        uuid id PK
        string transaction_code UK
        uuid source_account_id FK
        uuid target_account_id FK
        string target_bank_code
        string target_bank_name
        string target_account_number
        string target_account_name
        decimal amount
        decimal fee_amount
        string description
        string transaction_type
        string status
        string idempotency_key UK
        timestamp completed_at
        timestamp created_at
    }

    LEDGER_ENTRIES {
        uuid id PK
        uuid transaction_id FK
        uuid account_id FK
        string entry_type
        decimal amount
        decimal balance_after
        string description
        bigint sequence_number
        timestamp entry_time
    }

    SAVINGS_ACCOUNTS {
        uuid id PK
        string savings_code UK
        uuid customer_id FK
        uuid source_account_id FK
        decimal principal_amount
        decimal interest_rate
        integer term_months
        decimal expected_interest
        string auto_renewal_option
        string status
        timestamp start_date
        timestamp maturity_date
        timestamp created_at
        timestamp updated_at
    }

    BENEFICIARIES {
        uuid id PK
        uuid customer_id FK
        string beneficiary_name
        string account_number
        string bank_code
        string alias_name
        timestamp created_at
        timestamp updated_at
    }

    NOTIFICATIONS {
        uuid id PK
        uuid customer_id FK
        string title
        string message
        string notification_type
        string reference_type
        string reference_id
        boolean is_read
        timestamp created_at
    }

    KYC_DOCUMENTS {
        uuid id PK
        uuid customer_id FK
        string front_id_card_url
        string back_id_card_url
        string selfie_photo_url
        string status
        uuid verified_by_employee_id FK
        string rejection_reason
        timestamp submitted_at
        timestamp verified_at
    }

    CASH_TRANSACTIONS {
        uuid id PK
        string reference_code UK
        uuid account_id FK
        uuid teller_employee_id FK
        string operation_type
        decimal amount
        string depositor_name
        string depositor_national_id
        timestamp created_at
    }

    SYSTEM_CONFIGS {
        uuid id PK
        string config_key UK
        string config_value
        string description
        uuid updated_by_user_id FK
        timestamp updated_at
    }

    AUDIT_LOGS {
        uuid id PK
        uuid actor_id FK
        string actor_role
        string action_code
        string entity_name
        string entity_id
        boolean is_success
        string ip_address
        string user_agent
        jsonb metadata
        timestamp created_at
    }
```

---

## 2. Chi Tiết Tinh Chỉnh Cuối Cùng (Frozen State Polish)

1. **Lưu Snapshot Giao Dịch Liên Ngân Hàng (`TRANSACTIONS`)**:
   - Bổ sung `target_bank_name` & `target_account_name` để lưu lại thông tin snapshot của tài khoản ngân hàng ngoài (Interbank Transfer), tránh phụ thuộc vào dữ liệu tra cứu sau này.
2. **Diễn Giải Sổ Cái (`LEDGER_ENTRIES.description`)**:
   - Thêm cột `description` vào từng dòng sổ cái để dễ dàng truy vết và đối soát giao dịch kế toán.
3. **Định Dạng PostgreSQL `jsonb` Cho `AUDIT_LOGS.metadata`**:
   - Sử dụng chuẩn `JSONB` của PostgreSQL giúp đánh chỉ số GIN Index và truy vấn dữ liệu vết audit cực nhanh.
4. **Chuẩn Hóa Timestamps (`created_at` & `updated_at`)**:
   - Thêm `updated_at` cho tất cả các bảng thực thể thay đổi trạng thái theo thời gian (`users`, `customers`, `employees`, `accounts`, `cards`, `beneficiaries`, `savings_accounts`, `system_configs`).
5. **Quyết Định Đóng Băng Schema (Freeze Schema)**:
   - Dừng việc thêm mới các bảng dư thừa (như Kafka, AML, Fraud Engine...). Giữ nguyên cấu trúc 20 bảng cốt lõi để tập trung 100% nguồn lực vào phát triển Backend Spring Boot 3.3 chất lượng cao.
