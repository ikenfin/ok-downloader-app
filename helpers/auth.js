module.exports = {
  checkJWT (req, res, next) {
    const header = req.headers['authorization'];

    if (header) {
      return req.app.get('jwt').verify(header)
        .then((content) => {
          return req.app.get('redis').hgetall(`users:${content.id}`)
        })
        .then(user => {
          req.api = user
          next();
        })
        .catch((err) => {
          console.log('auth err', err)
          res.status(403);
        });
    }

    res.status(403);
  }
}