module.exports = (app) => {
  const express = require('express');
  const router = express.Router();

  const okApi = require('../helpers/ok')(app.get('network-keys').odnoklassniki);
  const { checkJWT } = require('../helpers/auth');

  router.get('/albums', checkJWT, function(req, res) {
    okApi.setToken(req.api.access_token)

    Promise.all([
      okApi.getAlbums(),
      okApi.getUserAlbum()
    ])
      .then(data => {
        const [ albums, user_album ] = data

        res.json({
          albums: [
            ...albums,
            user_album
          ]
        })
      })
      .catch(function (message) {
        res.json({
          error: true,
          message
        });
      });
  });

  router.post('/download', checkJWT, function (req, res) {
    const albums = req.body.albums;
    const token = req.api.access_token;
    const uid = req.api.uid;

    // set download task...
    app.get('downloader').queue.add({
      token,
      uid,
      albums
    })
      .then(job => {
        console.log('job...', job.id)
        app.get('socket').emit('downloader-job', job.id)
      })
      .catch(err => {
        console.error(err)
      })

    res.status(200).json({
      status: 200,
      body: 'ok'
    })
  });

  return router;
}