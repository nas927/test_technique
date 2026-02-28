const db = require('../database/db');

const fetchUser = async (name, value) => {
   const query = {
     name: 'fetch-user',
     text: `SELECT * FROM users WHERE ${name} = $1`,
     values: [value]
   }

   const result = await db.query(query);

   if (!result || result.rows.length < 1) 
      return null;
   return result.rows[0];
}

const fetchInvoicesFromUser = async (name, value) => {
   const query = {
     name: 'fetch-invoices',
     text: `SELECT * FROM invoices WHERE ${name} = $1`,
     values: [3]
   }

   const result = await db.query(query);

   if (!result || result.rows.length < 1) 
      return null;
   return result.rows;
}

const isAdmin = async (name, value, role_id) => {
   const query = {
     name: 'fetch-invoices',
     text: `SELECT role_id FROM users WHERE ${name} = $1`,
     values: [value]
   }

   const result = await db.query(query);

   console.log(result.rows[0])

   if (!result || result.rows.length < 1) 
      return false;
   if (result.rows[0].role_id === 1)
      return true;
   return false;
}

module.exports = {
    fetchUser,
    fetchInvoicesFromUser,
    isAdmin
}