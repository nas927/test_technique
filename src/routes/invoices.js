const express = require('express');
const pool = require('../database/db');
const auth = require('../middleware/auth');
const { fetchInvoicesFromUser } = require('../utils/db_utils');

const router = express.Router();

router.get('/:id', auth, async (req, res) => {
   let { id } = req.params;

   id = parseInt(id);
   if (typeof id !== "number" || isNaN(id))
   {
      res.status(201).json({ error: "Non autorisé !"});
      return;
   }
   const result = await fetchInvoicesFromUser("user_id", req.user.id);
   res.json(result);
});

module.exports = router;