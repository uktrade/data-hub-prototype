'use strict';

module.exports = function auth(req, res, next) {

  if (req.url !== '/login' && req.url !== '/error' && !req.session.token) {
    res.redirect('/login');
    return;
  }

  next();

};
