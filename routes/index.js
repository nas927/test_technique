const express = require('express');
const { doubleCsrf } = require("csrf-csrf");
const { postRequest } = require('../utils/request_utils');

const router = express.Router();
const { generateCsrfToken } = doubleCsrf({
  getSecret: () => process.env.SESSION_SECRET,
  getSessionIdentifier: (req) => req.session.id,
  cookieName: "xsrf_token",
  cookieOptions: { sameSite: "strict", secure: true },
});

router.get('/', (req, res) => {
  const csrfToken = generateCsrfToken(req, res, { validateOnReuse: false });
  postRequest('auth/login', { 
    email: 'admin@alpha.com',
    password: 'admin123',
    csrfToken: generateCsrfToken(req, res)
  }).then(async (data) => {
    const body = await data.json();
    console.log('Response from /test:', body);
    res.cookie('token', body.token, { httpOnly: true, sameSite: 'strict', secure: true });
    res.status(201).json({ message: 'Hello from the API!' });
  }).catch((error) => {
    console.error('Error fetching API data:', error);
    res.status(500).json({ error: 'Internal server error' });
  });
});

module.exports = router;