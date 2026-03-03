const express = require('express');
const jwt = require('jsonwebtoken');
const { csrfSynchronisedProtection } = require('../config/csrf')
const { verifyPassword } = require('../utils/secure_pass');
const { validate } = require('../utils/validation_express');
const { fetchToBdd, RLS } = require('../utils/db_utils');
const { body, validationResult } = require('express-validator')
const dotenv = require('dotenv');
const router = express.Router();

router.post('/login', csrfSynchronisedProtection,
  validate([
    body('email').isEmail().normalizeEmail().trim().escape().isString().isLength({ max: 255 })
      .withMessage('Email invalide'),
    body('password').escape().trim().isString().isLength({ min: 8, max: 255 })
  ]), async (req, res) => {
    const result = validationResult(req);

    try {
      await RLS(NaN, NaN, NaN, "bypassrls");
      const r = await fetchToBdd('users', 'email', req.body.email);
      await RLS(NaN, NaN, NaN,"utilisateur");
  
      if (r === undefined || !verifyPassword(req.body.password, r.password_hash))
        return res.status(401).json({ error: 'Invalid credentials' });
  
      const Accesstoken = jwt.sign(
        { id: r.id, role: r.role_id, tenant_id: r.tenant_id },
        process.env.JWT_SECRET,
        { algorithm: "HS384", expiresIn: '10m' }
      );
  
      const refreshToken = jwt.sign(
        { id: r.id, role: r.role_id, tenant_id: r.tenant_id },
        process.env.JWT_REFRESH_SECRET,
        { algorithm: "HS384", expiresIn: '1h' }
      );
      res.json({ refreshToken, user: { id: r.id, role: r.role_id, tenant_id: parseInt(r.tenant_id) } });
    }
    catch (err) {
      console.log(err);
      res.json({ error: "Une erreur est survenue !" });
    }

});

module.exports = router;