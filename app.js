const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const Redis = require('ioredis');
const jwt = require('./helpers/jwt');

const secret = require('./helpers/secrets');

var app = express();

const REDIS_HOST = process.env.REDIS_HOST || 'redis'
const REDIS_PORT = process.env.REDIS_PORT || 6379

const redisClient = new Redis(REDIS_PORT, REDIS_HOST)
const redisSubscriber = new Redis(REDIS_PORT, REDIS_HOST)
app.set('redis', redisClient)
app.set('redis-sub', redisSubscriber)

app.set('jwt', jwt(app));
app.set('jwt-secret-key', secret.get('jwt-secret-key'));

app.set('downloads-path', path.join(__dirname, '../ok-downloader-data/downloads'));

var Downloader = require('./downloader')({
  redis: {
    host: REDIS_HOST,
    port: REDIS_PORT
    // client: redisClient
  },
  downloadsPath: app.get('downloads-path')
});

Downloader.queue.empty().then(() => {
  app.set('downloader', Downloader)
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.set('network-keys', {
  odnoklassniki: {
    applicationSecretKey: secret.get('ok_secret_key'),
    applicationKey: secret.get('ok_public_key'),
    applicationId: secret.get('ok_app_id')
  }
});

var indexRouter = require('./routes/index')(app);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(_req, _res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
