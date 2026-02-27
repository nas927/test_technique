async function postRequest(url, data = {}, headers = {}) {
  return await fetch("http://localhost:3000/" + url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: JSON.stringify(data)
  });
}

module.exports = { postRequest };