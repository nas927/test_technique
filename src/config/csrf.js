const { csrfSync } = require("csrf-sync");

const {
  invalidCsrfTokenError, 
  generateToken, 
  getTokenFromRequest, 
  getTokenFromState, 
  storeTokenInState, 
  revokeToken,  
} = csrfSync();

const { csrfSynchronisedProtection } = csrfSync({
  getTokenFromRequest: (req, res) => {
    if (req.is("application/x-www-form-urlencoded"))
      return req.body["CSRFToken"];
    req.sessionID = req.headers.sessionid;
    req.session["csrfToken"] = req.headers["x-csrf-token"]
    return req.headers["x-csrf-token"];
  },
});

module.exports = {
  invalidCsrfTokenError, 
  generateToken, 
  getTokenFromRequest, 
  getTokenFromState, 
  storeTokenInState, 
  revokeToken, 
  csrfSynchronisedProtection
}