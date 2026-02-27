const csrfErrorHandler = (error, req, res, next) => {
  if (error === invalidCsrfTokenError) {
    res.status(403).json({
      error: "csrf validation erreur",
    });
  } else {
    next();
  }
};

module.exports = {
  csrfErrorHandler
};