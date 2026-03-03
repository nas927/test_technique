const express = require('express');
const auth = require('../middleware/auth')
const { isAdmin, RLS } = require("../utils/db_utils")
const db = require('../database/db');

const router = express.Router();

router.get('/stats', auth, async (req, res) => {
  if (!(await isAdmin("id", req.user.id, req.user.tenant_id)))
  {
    res.status(500).json({ error: "Une erreur est survenue !" })
    return;
  }

  await RLS(NaN, NaN, NaN, "bypassrls");
  try {
      const query = {
        name: 'fetch-for-invoices-from-admin',
        text: 'SELECT * FROM invoices',
      }
      const result = await db.query(query);
      console.log(result)
      const total = result.rows.reduce((sum, inv) => sum + inv.amount, 0);
    
      res.json({
        totalInvoices: result.rows.length,
        totalAmount: total,
        invoices: result.rows
      });
  }
  catch (err)
  {
    console.log(err);
    return;
  }
});
 
module.exports = router;
