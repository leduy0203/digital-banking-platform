# Database Design & Schema Specification - Digital Banking Platform

## 11. Database Design

The PostgreSQL database is structured to support multi-account financial operations with strict referential integrity, double-entry audit logging, and audit tracking on every record.

### 11.1 Mermaid Entity-Relationship Diagram (ERD)

```mermaid
erDiagram
    TBL_USER ||--o{ TBL_USER_ROLE : has
    TBL_ROLE ||--o{ TBL_USER_ROLE : mapped
    TBL_USER ||--o| TBL_CUSTOMER_PROFILE : owns
    TBL_CUSTOMER_PROFILE ||--o{ TBL_ACCOUNT : holds
    TBL_ACCOUNT ||--o{ TBL_TRANSACTION : initiates
    TBL_ACCOUNT ||--o{ TBL_BENEFICIARY : customizes
    TBL_ACCOUNT ||--o{ TBL_SAVINGS_ACCOUNT : funds
    TBL_TRANSACTION ||--|| TBL_AUDIT_LOG : tracks

    TBL_USER {
        bigserial id PK
        varchar email UK
        varchar password_hash
        varchar phone_number UK
        varchar status
        boolean mfa_enabled
        timestamp created_at
        timestamp updated_at
    }

    TBL_CUSTOMER_PROFILE {
        bigserial id PK
        bigint user_id FK
        varchar first_name
        varchar last_name
        varchar national_id UK
        date date_of_birth
        varchar address_line
        varchar kyc_status
    }

    TBL_ACCOUNT {
        bigserial id PK
        bigint customer_profile_id FK
        varchar account_number UK
        varchar account_type
        numeric balance
        numeric frozen_amount
        varchar currency
        varchar status
        bigint version
    }

    TBL_TRANSACTION {
        bigserial id PK
        varchar reference_number UK
        bigint source_account_id FK
        bigint target_account_id FK
        numeric amount
        numeric fee
        varchar transaction_type
        varchar status
        varchar description
        timestamp executed_at
    }

    TBL_SAVINGS_ACCOUNT {
        bigserial id PK
        bigint account_id FK
        numeric principal_amount
        numeric interest_rate
        int term_months
        date start_date
        date maturity_date
        varchar status
    }

    TBL_BENEFICIARY {
        bigserial id PK
        bigint account_id FK
        varchar beneficiary_account_number
        varchar beneficiary_name
        varchar nickname
        boolean is_favorite
    }

    TBL_AUDIT_LOG {
        bigserial id PK
        varchar entity_name
        bigint entity_id
        varchar action
        varchar performed_by
        jsonb old_value
        jsonb new_value
        timestamp created_at
    }
```

---

## 11.2 Entity Specifications & Attribute Details

### 1. `tbl_user` (Authentication Core)
| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `BIGSERIAL` | Primary Key | Internal surrogate identifier. |
| `email` | `VARCHAR(150)` | NOT NULL, UNIQUE | User primary login credential & contact email. |
| `password_hash` | `VARCHAR(255)` | NOT NULL | BCrypt hashed security password string. |
| `phone_number` | `VARCHAR(20)` | NOT NULL, UNIQUE | Customer mobile contact number. |
| `status` | `VARCHAR(30)` | NOT NULL, Default `'ACTIVE'` | Account status: `ACTIVE`, `SUSPENDED`, `LOCKED`. |
| `failed_login_attempts` | `INT` | NOT NULL, Default `0` | Failed password attempt counter. |
| `created_at` | `TIMESTAMP` | NOT NULL | Creation timestamp. |
| `updated_at` | `TIMESTAMP` | NOT NULL | Last modification timestamp. |

### 2. `tbl_account` (Core Banking Ledgers)
| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `BIGSERIAL` | Primary Key | Account surrogate key. |
| `customer_profile_id` | `BIGINT` | NOT NULL, FK (`tbl_customer_profile.id`) | Foreign key linking account to owner profile. |
| `account_number` | `VARCHAR(20)` | NOT NULL, UNIQUE, Index | 10-digit customer-facing account number. |
| `account_type` | `VARCHAR(20)` | NOT NULL | `CHECKING`, `SAVINGS`. |
| `balance` | `NUMERIC(18, 4)` | NOT NULL, Check (`balance >= 0`) | Available ledger balance. |
| `frozen_amount` | `NUMERIC(18, 4)` | NOT NULL, Default `0.0000` | Amount locked for pending holds/transfers. |
| `currency` | `VARCHAR(3)` | NOT NULL, Default `'USD'` | ISO 4217 Currency code. |
| `status` | `VARCHAR(20)` | NOT NULL, Default `'ACTIVE'` | Account state: `ACTIVE`, `FROZEN`, `CLOSED`. |
| `version` | `BIGINT` | NOT NULL, Default `0` | Optimistic locking control column for JPA `@Version`. |

---

## 12. Database Naming Conventions

To ensure consistency across migrations, developers must follow these SQL conventions:
- **Tables**: Lowercase singular/plural with `tbl_` prefix (e.g., `tbl_user`, `tbl_account`).
- **Columns**: Lowercase snake_case (e.g., `account_number`, `created_at`).
- **Primary Keys**: Name column `id` with type `BIGSERIAL` / `BIGINT`.
- **Foreign Keys**: Column named `[target_table_singular]_id` (e.g., `customer_profile_id`). Constraint named `fk_[source_table]_[target_table]` (e.g., `fk_tbl_account_tbl_customer_profile`).
- **Unique Indexes**: Constraint named `uk_[table]_[column]` (e.g., `uk_tbl_account_account_number`).
- **Monetary Precision**: All currency balances stored as `NUMERIC(18, 4)` to prevent floating-point rounding errors.

---

## 12.1 Flyway Database Migration (`V1__init_schema.sql`)

```sql
-- Initial Schema Migration Script
CREATE TABLE tbl_user (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(150) NOT NULL CONSTRAINT uk_tbl_user_email UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL CONSTRAINT uk_tbl_user_phone UNIQUE,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    failed_login_attempts INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tbl_customer_profile (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL CONSTRAINT fk_customer_profile_user REFERENCES tbl_user(id) ON DELETE CASCADE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    national_id VARCHAR(30) NOT NULL CONSTRAINT uk_customer_national_id UNIQUE,
    date_of_birth DATE NOT NULL,
    address_line VARCHAR(255),
    kyc_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tbl_account (
    id BIGSERIAL PRIMARY KEY,
    customer_profile_id BIGINT NOT NULL CONSTRAINT fk_tbl_account_customer REFERENCES tbl_customer_profile(id),
    account_number VARCHAR(20) NOT NULL CONSTRAINT uk_tbl_account_number UNIQUE,
    account_type VARCHAR(20) NOT NULL,
    balance NUMERIC(18, 4) NOT NULL CONSTRAINT chk_account_balance CHECK (balance >= 0),
    frozen_amount NUMERIC(18, 4) NOT NULL DEFAULT 0.0000,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tbl_account_number ON tbl_account(account_number);
CREATE INDEX idx_tbl_account_customer ON tbl_account(customer_profile_id);
```
