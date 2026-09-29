-- =============================================================================
-- Flyway Migration: V5__add_transaction_pin_to_customers.sql
-- Description: Add Transaction PIN fields to customers table
-- =============================================================================

ALTER TABLE customers
    ADD COLUMN IF NOT EXISTS transaction_pin_hash VARCHAR(255),
    ADD COLUMN IF NOT EXISTS pin_failed_attempts INT NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS pin_locked_until TIMESTAMP WITH TIME ZONE;
