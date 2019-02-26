const clearUserData = require('./cleaner')

module.exports = (app, client) => {
  return {
    logout (uid) {
      // console.log('logout helper...', uid)
      clearUserData(app.get('redis'), app.get('downloads-path'), uid)
        // .then(() => {
        //   client.to(`user:${uid}`).emit('logout:complete', { ok: 'ok' })
        // })
        // .catch(err => {
        //   console.error('errror:', err)
        // })
    }
  }
}