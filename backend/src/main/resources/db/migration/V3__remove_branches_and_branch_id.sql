-- =============================================================================
-- Flyway Migration: V3__remove_branches_and_branch_id.sql
-- Description: Xoá bỏ phân hệ chi nhánh (branches) và branch_id trong employees
-- =============================================================================

-- 1. Xoá cột branch_id (và foreign key liên kết) trong bảng employees
ALTER TABLE employees 
    DROP COLUMN IF EXISTS branch_id;

-- 2. Xoá bảng branches
DROP TABLE IF EXISTS branches CASCADE;
