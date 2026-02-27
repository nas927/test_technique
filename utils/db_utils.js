const db = require('../db');

const fetchUser = async (name, value) => {
   const query = {
     name: 'fetch-user',
     text: `SELECT id, email, role_id, tenant_id, password_hash FROM users WHERE ${name} = $1`,
     values: [value]
   }
 
   const result = await db.query(query);

   if (result.rows.length === 0) 
      return null;
   return result.rows[0];
}

module.exports = {
    fetchUser
}