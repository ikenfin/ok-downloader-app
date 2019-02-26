module.exports = function(app) {
  const express = require('express');
  const router = express.Router();
  const redis = app.get('redis')
  const fs = require('fs')
  const auth = require('./auth')(app),
        api = require('./api')(app);

  router.get('/download-zip/:uid/:uuid', (req, res) => {
    const { uuid, uid } = req.params

    if (!uuid || !uid) {
      res.status(403).render({
        message: 'Not authorized'
      })
    }
    else {
      const redisKey = `zipped:${uid}:${uuid}`

      redis.hgetall(redisKey, (err, data) => {
        if (err) {
          res.status(400).send('Sorry, can\t process your request:(')
        }
        else if (data.zipPath && fs.existsSync(data.zipPath)) {
          redis.hincrby(redisKey, 'downloadCount', 1)
          res.sendFile(data.zipPath)
        }
        else {
          res.status(404).render('error', {
            message: 'Файл не найден'
          })
        }
      })
    }
  });

  // auth controller
  router.use('/auth', auth);

  // api controller
  router.use('/api', api);

  /* GET home page. */
  router.get('/', function(req, res) {
    res.render('index')
  });

  router.get('/policy', function (req, res) {
    res.render('policy')
  });

  router.get('/app', function (req, res) {
    res.render('app')
  });

  return router;
}