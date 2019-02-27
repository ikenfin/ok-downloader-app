const clearUserData = require('./cleaner')

module.exports = (app, _client) => {
  return {
    // on logout - clean data and remove user
    logout (uid) {
      // console.log('logout helper...', uid)
      clearUserData(app.get('redis'), app.get('downloads-path'), uid)
        .then(() => {
          console.log('clear user data (helper)', new Date())
          const pipeline = app.get('redis').pipeline()
          pipeline.del(`users:${uid}`)
          pipeline.zrem('users-refresh', uid)
          pipeline.publish('user:deleted', uid)
          return pipeline.exec()
        })
    }
  }
}