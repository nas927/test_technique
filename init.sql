DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS tenants;

CREATE TABLE tenants (
  id SERIAL PRIMARY KEY,
  name TEXT
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT,
  password TEXT,
  role TEXT,
  tenant_id INTEGER REFERENCES tenants(id)
);

CREATE TABLE invoices (
  id SERIAL PRIMARY KEY,
  amount INTEGER,
  tenant_id INTEGER REFERENCES tenants(id),
  user_id INTEGER REFERENCES users(id)
);

INSERT INTO tenants (name) VALUES ('Tenant Alpha'), ('Tenant Beta');

INSERT INTO users (email, password, role, tenant_id) VALUES
  ('admin@alpha.com', 'admin123', 'admin', 1),
  ('user@alpha.com', 'user123', 'user', 1),
  ('admin@beta.com', 'admin456', 'admin', 2),
  ('user@beta.com', 'user456', 'user', 2);

INSERT INTO invoices (amount, tenant_id, user_id) VALUES
  (1500, 1, 1),
  (2300, 1, 2),
  (890, 1, 1),
  (4200, 2, 3),
  (1100, 2, 4),
  (750, 2, 3);
