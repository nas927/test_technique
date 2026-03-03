const express = require('express');
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
   await RLS(NaN, req.user.tenant_id, req.user.id, "");
   try {
      const result = await fetchToBdd("invoices", "user_id", req.user.id);
      if (!result)
         res.json({ error: "Veuillez retenter !"});
      res.json(result)
   }
   catch (err) {
      console.log(err)
      res.json({error: "Une erreur est survenue !"})
   }
});

module.exports = router;