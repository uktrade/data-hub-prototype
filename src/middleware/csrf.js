module.exports = (req, res, next) => {
  if (req.method !== 'POST' || req.url === '/login') {
    return next();
  }

  try {
    const requestCsrf = req.get('X-CSRF-TOKEN');
    const sessionCsrf = req.session.csrfToken;

    // Not matter what, reset the token.
    req.session.csrfToken = null;

    if (!requestCsrf || !sessionCsrf || requestCsrf !== sessionCsrf) {
      throw true;
    }
  } catch (e) {
    return res.sendStatus(400);
  }

  return next();
};
