const { rateLimit } = require('express-rate-limit');

const rateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  message: {
    error: "Trop de requete."
  },
  standardHeaders: false,
  legacyHeaders: false, 
});

module.exports = {
    limiter: rateLimit
};