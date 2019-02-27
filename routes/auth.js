module.exports = (app) => {
  const express = require('express');
  const router = express.Router();
  const okApi = require('../helpers/ok')(app.get('network-keys').odnoklassniki);

  const path = require('path');

  router.get('/', function(req, res) {
    const returnUrl = `${req.protocol}://${req.get('host')}/auth/ok`
    res.redirect(okApi.getAuthUrl(returnUrl));
  });

  // router.get('/logout', (req, res) => {
    // app.get('socket').emit('logout')
  // });

  router.get('/ok', function(req, res) {
    if (req.query.code) {
      const returnUrl = `${req.protocol}://${req.get('host')}/auth/ok`
      let code = req.query.code;
      let tokenPromise = okApi.auth(code, returnUrl);

      tokenPromise
        .then(async (auth_data) => {
          const id = await okApi.setToken(auth_data.access_token).getUserId()

          return {
            id,
            ...auth_data
          }
        })
        .then(({ id, access_token, refresh_token, expires_in }) => {
          const downloadPath = path.join(app.get('downloads-path'), id)

          return app.get('redis')
            .hmset(`users:${id}`, {
              id,
              access_token,
              refresh_token,
              expires_in,
              downloadPath
            })
            .then(() => app.get('jwt').sign({ id }))
        })
        .then((token) => {
          res.render('jwt', {
            token,
            redirect: '/app'
          });
        })
    }
    else {
      res.status(403).render('error', {
        message: 'Not authorized'
      })
    }
  });

  return router;
}