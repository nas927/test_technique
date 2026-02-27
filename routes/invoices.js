const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  const result = await pool.query('SELECT * FROM invoices');
  res.json(result.rows);
});

module.exports = router;
