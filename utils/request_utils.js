const { default: axios } = require("axios");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

async function postRequest(url, data = {}, headers) {
  return await axios.post(`https://localhost:3000/${url}`, data, {
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    withCredentials: true,
    httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }),
    data: JSON.stringify(data)
  });
}

async function getRequest(url, bearer) {
  return await axios.get(`https://localhost:3000/${url}`, {
    headers: {
      "Authorization": "Bearer " + bearer
    },
    withCredentials: true,
    httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }),
  });
}

module.exports = { postRequest, getRequest };