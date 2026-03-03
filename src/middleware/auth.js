const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) 
    return res.status(401).json({ error: 'Autorisation !' });

  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(atob(token), process.env.JWT_REFRESH_SECRET, { algorithms: ['HS384'] });
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'token invalide vous devez sûrement vous reconnecter' });
  }
}

module.exports = auth;
