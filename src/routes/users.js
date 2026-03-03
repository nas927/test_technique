const express = require('express');
const pool = require('../database/db');
const auth = require('../middleware/auth');
const { fetchToBdd, RLS } = require('../utils/db_utils');

const router = express.Router();

router.get('/:id', auth, async (req, res) => {
  let { id } = req.params;
  id = parseInt(id);

  if (typeof id !== "number" || isNaN(id))
  {
    res.status(201).json({ error: "Non autorisé !"});
    return;
  }

  await RLS(req.user.id, req.user.tenant_id, NaN, "");
  const result = await fetchToBdd("users", "id", req.user.id);

  if (!result)
    return res.status(404).json({ error: 'Veuillez retenter' });

  res.json({user: result.id});
});

module.exports = router;
