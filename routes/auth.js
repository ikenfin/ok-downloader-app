module.exports = (app) => {
  const express = require('express');
  const router = express.Router();
  const okApi = require('../helpers/ok')(app.get('network-keys').odnoklassniki);

  const mkdirp = require('mkdirp'),
        path = require('path');

  router.get('/', function(req, res) {
    res.redirect(okApi.getAuthUrl('http://localhost:8080/auth/ok'));
  });

  router.get('/logout', (req, res) => {
    // app.get('socket').emit('logout')
  });

  router.get('/ok', function(req, res) {
    let code = req.query.code;
    let tokenPromise = okApi.auth(code, 'http://localhost:8080/auth/ok');

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
        // mkdirp.sync(downloadPath)
        // req.session.uid = id

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
  });

  return router;
}