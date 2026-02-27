const express = require('express');
const auth = require('../middleware/auth')
const { isAdmin } = require("../utils/db_utils")
const pool = require('../db');

const router = express.Router();

router.get('/stats', auth, async (req, res) => {
  if (!(await isAdmin("id", req.user.id, req.user.role)))
  {
    res.status(500).json({ error: "Non admin !" })
    return;
  }
  const query = {
  // give the query a unique name
    name: 'fetch-for-admins',
    text: 'SELECT * FROM invoices',
  }
  const result = await pool.query(query);
  const total = result.rows.reduce((sum, inv) => sum + inv.amount, 0);

  res.json({
    totalInvoices: result.rows.length,
    totalAmount: total,
    invoices: result.rows
  });
});

module.exports = router;
