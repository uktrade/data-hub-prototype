module.exports = (req, res, next) => {
  if (req.method !== 'POST' || req.url === '/login') {
    return next();
  }

  try {
    const sessionCsrf = req.session.csrfToken;
    let requestCsrf;

    // Look for the csrf token first in the form body, if not then the http headers
    if (req.body && req.body._csrf_token) {
      requestCsrf = req.body._csrf_token;
    } else {
      requestCsrf = req.get('x-csrf-token');
    }

    // Not matter what, reset the token now it has been used.
    req.session.csrfToken = null;

    if (!requestCsrf || !sessionCsrf || requestCsrf !== sessionCsrf) {
      throw true;
    }
  } catch (e) {
    return res.sendStatus(400);
  }

  return next();
};