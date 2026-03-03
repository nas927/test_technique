const db = require('../database/db');

const fetchToBdd = async (table, name, value) => {
   const query = {
     name: 'fetch-user',
     text: `SELECT * FROM ${table} WHERE ${name} = $1`,
     values: [value]
   }

   try {
      const result = await db.query(query);
      if (!result || result.rows.length < 1) 
         return;
      return result.rows[0];
   }
   catch (err)
   {
      return;
   }
}

const RLS = async (userId, tenantId, invoicesUserId, role) => {
   try {
      if (role !== "")
         await db.query('SET ROLE = ' + role);
      if (!isNaN(tenantId))
         await db.query('SET app.tenant_id = ' + tenantId);
      if (!isNaN(invoicesUserId))
         await db.query('SET app.user_id = ' + invoicesUserId);
      if (!isNaN(userId))
         await db.query('SET app.id = ' + userId);
      return true;
   }
   catch (err)
   {
      console.log(err);
      return;
   }
}

const isAdmin = async (name, userId, tenantId) => {
   await RLS(userId, tenantId, userId, "");
   const query = {
     name: 'is-admin',
     text: `SELECT role_id FROM users WHERE ${name} = $1`,
     values: [userId]
   }

   try {
      const result = await db.query(query);
      if (!result || result.rows.length < 1) 
         return;
      if (result.rows[0].role_id === 1)
         return true;
      return;
   } catch (err) {
      return;
   }

}

module.exports = {
    fetchToBdd,
    isAdmin,
    RLS
}