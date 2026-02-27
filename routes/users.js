const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const { fetchUser } = require('../utils/db_utils');

const router = express.Router();

router.get('/:id', auth, async (req, res) => {
  const { id } = req.params;

  const result = await fetchUser(id);

  if (result.rows.length === 0)
    return res.status(404).json({ error: 'User not found' });

  res.json(result.rows[0]);
});

module.exports = router;
