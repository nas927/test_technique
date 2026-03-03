const { rateLimit } = require('express-rate-limit');

const rateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  standardHeaders: false,
  legacyHeaders: false, 
  message: {
    error: "Trop de requete."
  },
});

module.exports = {
    limiter: rateLimit
};