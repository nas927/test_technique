const express = require('express');
const pool = require('../database/db');
const auth = require('../middleware/auth');
const { fetchUser } = require('../utils/db_utils');

const router = express.Router();

router.get('/:id', auth, async (req, res) => {
  let { id } = req.params;
  id = parseInt(id);

  if (typeof id !== "number" || isNaN(id))
  {
    res.status(201).json({ error: "Non autorisé !"});
    return;
  }

  const result = await fetchUser("id", req.user.id);

  if (result === null)
    return res.status(404).json({ error: 'User not found' });

  res.json({user: result.id});
});

module.exports = router;
