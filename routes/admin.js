const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/stats', async (req, res) => {
  const result = await pool.query('SELECT * FROM invoices');
  const total = result.rows.reduce((sum, inv) => sum + inv.amount, 0);

  res.json({
    totalInvoices: result.rows.length,
    totalAmount: total,
    invoices: result.rows
  });
});

module.exports = router;
