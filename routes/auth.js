const express = require('express');
const jwt = require('jsonwebtoken');
const { doubleCsrf } = require("csrf-csrf");
const { csrfErrorHandler } = require('../utils/secure_csrf');
const { verifyPassword } = require('../utils/secure_pass');
const { validate } = require('../utils/validation_express');
const pool = require('../db');
const { fetchUser } = require('../utils/db_utils');
const { body, validationResult } = require('express-validator')
const dotenv = require('dotenv');

dotenv.config();

const { invalidCsrfTokenError, doubleCsrfProtection } = doubleCsrf({
  getSecret: () => process.env.SESSION_SECRET,
  getSessionIdentifier: (req) => req.session.id,
  cookieName: "xsrf_token",
  cookieOptions: { sameSite: "strict", secure: true },
});
const router = express.Router();

router.post('/login', validate([
    body('email').isEmail().normalizeEmail().escape().isString().isLength({ max: 255 })
      .withMessage('Email invalide'),
    body('password').isString().isLength({ min: 8, max: 255 })
  ], doubleCsrfProtection, csrfErrorHandler), async (req, res) => {
    const result = validationResult(req);

    const r = await fetchUser('email', req.body.email);
    console.log('User fetched from DB:', r);

    if (r === null)
      return res.status(401).json({ error: 'Invalid credentials' });

    if (!verifyPassword(req.body.password, r.password_hash))
      return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: r.id, role: r.role, tenant_id: r.tenant_id },
      process.env.JWT_SECRET,
      { algorithm: "HS384", expiresIn: '1h' }
    );

    res.json({ token, user: { id: r.id, email: r.email, role: r.role } });
});

module.exports = router;