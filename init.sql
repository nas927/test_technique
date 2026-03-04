DROP DATABASE IF EXISTS test;
CREATE DATABASE test;

TRUNCATE TABLE invoices, users, tenants RESTART IDENTITY CASCADE;
DROP TABLE IF EXISTS invoices, users, tenants CASCADE;
REASSIGN OWNED BY utilisateur TO postgres;
DROP OWNED BY utilisateur;
DROP ROLE IF EXISTs utilisateur;
DROP ROLE IF EXISTs bypassrls;

CREATE USER utilisateur PASSWORD 'nassim92'; -- Choisir un long mot de passe
GRANT CONNECT ON DATABASE test TO utilisateur;
GRANT USAGE ON SCHEMA public TO utilisateur;
CREATE ROLE bypassrls;
ALTER ROLE bypassrls BYPASSRLS;
GRANT bypassrls TO utilisateur;

GRANT CONNECT ON DATABASE test TO bypassrls;
GRANT USAGE ON SCHEMA public TO bypassrls;

DROP POLICY IF EXISTS users_isolation ON users;
DROP POLICY IF EXISTS invoices_isolation ON invoices;

CREATE TABLE IF NOT EXISTS tenants (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role_id SMALLINT NOT NULL,
  tenant_id SMALLINT REFERENCES tenants(id) ON DELETE CASCADE,
  ip_address VARCHAR(45) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT role_check CHECK (role_id IN (1, 2)),
  CONSTRAINT tenants_check CHECK (tenant_id IN (1, 2)),
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE TABLE IF NOT EXISTS invoices (
  id SERIAL PRIMARY KEY,
  amount BIGINT NOT NULL,
  ip_address VARCHAR(45) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  tenant_id SMALLINT REFERENCES tenants(id) ON DELETE CASCADE,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE users FORCE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices FORCE ROW LEVEL SECURITY;

CREATE POLICY users_isolation ON users FOR ALL
USING (
  tenant_id = current_setting('app.tenant_id', true)::SMALLINT
  AND
  id = current_setting('app.id', true)::BIGINT
)
WITH CHECK (
  tenant_id = current_setting('app.tenant_id', true)::SMALLINT
);

CREATE POLICY invoices_isolation ON invoices FOR ALL
USING (
  tenant_id = current_setting('app.tenant_id', true)::SMALLINT
  AND
  user_id = current_setting('app.user_id', true)::BIGINT
)
WITH CHECK (
  tenant_id = current_setting('app.tenant_id', true)::SMALLINT
);

GRANT SELECT ON TABLE public.users TO utilisateur;
GRANT SELECT ON TABLE public.invoices TO utilisateur;
GRANT SELECT ON TABLE public.users TO bypassrls;
GRANT SELECT ON TABLE public.invoices TO bypassrls;

INSERT INTO tenants (name) VALUES ('Tenant Alpha'), ('Tenant Beta');

INSERT INTO users (email, password_hash, role_id, tenant_id, ip_address, created_at) VALUES
  ('admin@alpha.com', '$2b$12$CjBBRhRZKkla3GcjwqHbxObkmabqXe3j1u3T0QIkPMFXuUPjkYMMi', 1, 1, '192.168.1.1', CURRENT_TIMESTAMP),
  ('user@alpha.com', '$2b$12$g8SZUM4dyroncBjecohmqOoWUqOrVCngmJb5B2fxvzkJojVa5NlxO', 2, 1, '192.168.1.2', CURRENT_TIMESTAMP),
  ('admin@beta.com', '$2b$12$zMceVXfH1PXBol5Di9eVae4bNouMX5eChxyh6WchFy7enMOjITrF.', 1, 2, '192.168.2.1', CURRENT_TIMESTAMP),
  ('user@beta.com', '$2b$12$SKX9P0SCHYuwKa2hpT3xQ.oDrIrR476rdhCw8ve6dcBnSwOSrzDlG', 2, 2, '192.168.2.2', CURRENT_TIMESTAMP);

INSERT INTO invoices (amount, tenant_id, user_id, ip_address,created_at) VALUES
  (1500, 1, 1, '192.168.1.1', CURRENT_TIMESTAMP),
  (2300, 1, 2, '192.168.1.2', CURRENT_TIMESTAMP),
  (890, 1, 1, '192.168.1.3', CURRENT_TIMESTAMP),
  (4200, 2, 3, '192.168.2.1', CURRENT_TIMESTAMP),
  (1100, 2, 4, '192.168.2.2', CURRENT_TIMESTAMP),
  (750, 2, 3, '192.168.2.3', CURRENT_TIMESTAMP);
