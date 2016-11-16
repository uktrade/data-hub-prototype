'use strict';

const config = require( '../config' );
const authorisedRequest = require( '../lib/authorisedrequest' );

module.exports = function(req, res, next) {

  const token = req.session.token;
  const user = req.session.user;

  if (token && !user) {

    const opts = {
      url: `${config.apiRoot}/whoami/`,
      json: true
    };

    authorisedRequest(token, opts)
      .then(userInfo => {
        req.session.user = {
          id: userInfo.id, // DIT Advisor id
          name: userInfo.name,
          team: userInfo.dit_team
        };

        res.locals.user = req.session.user;
        next();
      })
      .catch(error => {
        res.render('error', {error});
      });

  } else {

    if (user) {
      res.locals.user = user;
    }

    next();
  }
};
