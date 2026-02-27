const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const { fetchInvoicesFromUser } = require('../utils/db_utils');

const router = express.Router();

router.get('/:id', auth, async (req, res) => {
   const { id } = req.params;
   const result = fetchInvoicesFromUser("user_id", id);
   res.json(result);
});

module.exports = router;
