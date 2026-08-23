-- 1. Insert Base Roles
INSERT INTO roles (id, role_code, role_name)
VALUES
    (gen_random_uuid(), 'ROLE_CUSTOMER', 'Individual Retail Customer'),
    (gen_random_uuid(), 'ROLE_ADMIN', 'System Administrator'),
    (gen_random_uuid(), 'ROLE_TELLER', 'Bank Teller')
    ON CONFLICT (role_code) DO NOTHING;

-- 2. Insert Base Permissions
INSERT INTO permissions (id, permission_code, permission_name)
VALUES
    (gen_random_uuid(), 'user:read', 'View personal profile details'),
    (gen_random_uuid(), 'user:write', 'Update personal profile details'),
    (gen_random_uuid(), 'account:read', 'View bank account details and balance'),
    (gen_random_uuid(), 'transfer:create', 'Execute fund transfer transactions'),
    (gen_random_uuid(), 'system:admin', 'Full system administration access')
    ON CONFLICT (permission_code) DO NOTHING;

-- 3. Assign Permissions to ROLE_CUSTOMER
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.role_code = 'ROLE_CUSTOMER'
  AND p.permission_code IN ('user:read', 'user:write', 'account:read', 'transfer:create')
    ON CONFLICT DO NOTHING;

-- 4. Assign All Permissions to ROLE_ADMIN
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.role_code = 'ROLE_ADMIN'
    ON CONFLICT DO NOTHING;