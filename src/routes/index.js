const express = require('express');
const { generateToken } = require('../config/csrf');
const { postRequest, getRequest } = require('../utils/request_utils');

const router = express.Router();

router.get('/', (req, res) => {
  const csrfToken = generateToken(req, res);
  postRequest('auth/login', { 
      email: 'admin@alpha.com',
      password: 'admin123'
    },
    {
      "x-csrf-token": csrfToken,
      "SessionID": req.sessionID
    }).then(async (data) => {
      res.cookie('token', btoa(data.data.refreshToken), { httpOnly: true, sameSite: 'strict', secure: true });
      res.status(201).json({ message: 'Connected !' });
    }).catch((error) => {
      console.error('Error in /test route:', error);
      res.status(500).json({ error: 'Internal server error' });
    });

  // getRequest('admin/stats', req.cookies.token).then(async (data) => {
  //     res.status(201).json(data.data);
  //   }).catch((error) => {
  //     console.error('Error in /test route:', error);
  //     res.status(500).json({ error: 'Internal server error' });
  //   });

  // getRequest('invoices/2', req.cookies.token).then(async (data) => {
  //     res.status(201).json(data.data);
  //   }).catch((error) => {
  //     //console.error('Error in /test route:', error);
  //     res.status(500).json({ error: 'Internal server error' });
  //   });

  // getRequest('users/2', req.cookies.token).then(async (data) => {
  //     res.status(201).json(data.data);
  //   }).catch((error) => {
  //     console.error('Error in /test route:', error);
  //     res.status(500).json({ error: 'Internal server error' });
  //   });

  });

module.exports = router;