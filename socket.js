const uuid = require('node-uuid')
const EVENT_DEL = 'user:deleted'

module.exports = (app, client) => {
  const helpers = require('./helpers/socket')(app, client)

  // logout user from server
  app.get('redis-sub').on('message', (channel, uid) => {
    switch (channel) {
      case EVENT_DEL:
        client.to(`user:${uid}`).emit('logout:complete', { ok: 'ok' })
        break
    }
  })

  app.get('redis-sub').subscribe(EVENT_DEL)

  // logout user by client event
  client.on('logout', () => {
    if (client.authData) {
      const uid = client.authData.id;
      console.log('logotutututut')
      helpers.logout(uid)
      client.disconnect()
    }
  })

  client.on('download', async (opts) => {
    const redis = app.get('redis');
    const uid = client.authData.id;

    // check if user has no tasks at the moment
    const activeJobId = await redis.get(`users:active-bull:${uid}`)
    const job = await app.get('downloader').queue.getJob(activeJobId)

    if (job) {
      client.emit('download:progress', job._progress)
    }
    else {
      redis.del(`users:active-bull:${uid}`)

      const albums = opts.albums;
      const data = await redis.hgetall(`users:${client.authData.id}`)
      const access_token = data.access_token;
      const HOUR = 60 * 60;

      // set download task...
      app.get('downloader').queue.add({
        access_token,
        uid,
        albums
      })
        .then(job => {
          redis.set(`users:active-bull:${uid}`, job.id, 'ex', HOUR)

          job.queue.on('global:progress', (id, progress) => {
            if (job.id === id) {
              client.emit('download:progress', progress)
            }
          })
          job.queue.on('global:completed', (id, result) => {
            if (job.id === id) {
              const { zipPath } = JSON.parse(result)
              const uniqKey = uuid.v4()

              redis.del(`users:active-bull:${uid}`)

              const time = Date.now()

              const pipeline = redis.pipeline()

              // add to sorted list
              pipeline.zadd('completed-jobs', time, uid)
              pipeline.hmset(`zipped:${uid}:${uniqKey}`, {
                time,
                downloadCount: 0,
                zipPath
              })

              pipeline.exec()
                .then(_response => {
                  job.remove()
                  client.emit('download:complete', {
                    uuid: uniqKey,
                    downloadUrl: `/download-zip/${uid}/${uniqKey}`
                  })
                })
            }
            console.log('complete', id)
          })
        })
        .catch(err => {
          console.log('err,', err)
        })
    }
  })

  client.on("disconnect", () => console.log("closed connection"))
}