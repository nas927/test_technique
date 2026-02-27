const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query(
    `SELECT id, email, password, role, tenant_id FROM users WHERE email = '${email}'`
  );

  if (result.rows.length === 0) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const user = result.rows[0];
  if (user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role, tenant_id: user.tenant_id },
    'secret'
  );

  res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
});

module.exports = router;
