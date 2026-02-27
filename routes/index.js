const express = require('express');
const { generateToken } = require('../config/csrf');
const { postRequest, getRequest } = require('../utils/request_utils');

const router = express.Router();

router.get('/', (req, res) => {
  const csrfToken = generateToken(req, res);
  console.log(req.sessionID);
  // postRequest('auth/login', { 
  //     email: 'admin@alpha.com',
  //     password: 'admin123'
  //   }).then(async (data) => {
  //     res.cookie('token', data.data.token, { httpOnly: true, sameSite: 'strict', secure: true });
  //     res.status(201).json({ message: 'Hello from the API!' });
  //   }).catch((error) => {
  //   // console.error('Error in /test route:', error);
  //     res.status(500).json({ error: 'Internal server error' });
  //   });
  // });

  getRequest('admin/stats', req.cookies.token).then(async (data) => {
      res.status(201).json(data.data);
    }).catch((error) => {
      //console.error('Error in /test route:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
  });

module.exports = router;