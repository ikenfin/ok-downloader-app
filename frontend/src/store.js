import Vue from 'vue'
import Vuex from 'vuex'
import { genVuexModels } from 'vuex-models'
import io from 'socket.io-client'

const IOPlugin = {
  async install (Vue, _opts) {
    const socket = io({
      path: '/socket',
      reconnection: true
    })

    Vue.$socket = socket
  }
}

Vue.use(Vuex)
Vue.use(IOPlugin)

const data = {
  ...genVuexModels({
    accessToken: '',
    albums: []
  }, 'localData')
}

const store = new Vuex.Store({
  modules: {
    data
  },
  state: {
    auth: {
      pending: false,
      token: '',
      id: ''
    },
    jobId: null,
    downloadComplete: false,
    downloadUrl: null,
    downloadProgress: 0,
    downloadInProgress: false
  },
  actions: {
    authenticate ({ commit }, token) {
      commit('SET_AUTH_PENDING')
      Vue.$socket.emit('authentication', token)

      Vue.$socket.on('authenticated', (id) => {
        if (id === false) {
          console.error('reauth...')
        } else {
          commit('UNSET_AUTH_PENDING')
          commit('SET_AUTH_DATA_COMPLETE', { token, id })
        }
      })
      Vue.$socket.on('logout:complete', () => {
        commit('UNSET_AUTH_PENDING')
        commit('LOGOUT')
      })

      Vue.$socket.on('reconnect', () => {
        Vue.$socket.emit('authentication', token)
      })
    },
    logout ({ commit }) {
      commit('RESET_AUTH_DATA')
      commit('SET_AUTH_PENDING')
      Vue.$socket.emit('logout')
    },
    async download ({ commit }, request) {
      commit('UNSET_DOWNLOAD_COMPLETE')
      commit('SET_DOWNLOAD_PENDING')
      commit('SET_DOWNLOAD_PROGRESS', 0)

      Vue.$socket.on('download:progress', (percent) => {
        commit('SET_DOWNLOAD_PROGRESS', percent)
      })

      Vue.$socket.on('download:complete', (job) => {
        commit('UNSET_DOWNLOAD_PENDING')
        commit('SET_DOWNLOAD_COMPLETE', job.downloadUrl)
      })

      Vue.$socket.emit('download', request)
    }
  },
  mutations: {
    SET_DOWNLOAD_COMPLETE (state, url) {
      state.downloadComplete = true
      state.downloadUrl = url
    },
    UNSET_DOWNLOAD_COMPLETE (state) {
      state.downloadComplete = false
    },
    SET_DOWNLOAD_PENDING (state) {
      state.downloadInProgress = true
    },
    UNSET_DOWNLOAD_PENDING (state) {
      state.downloadInProgress = false
    },
    RESET_AUTH_DATA (state) {
      state.auth.id = null
      state.auth.token = null
    },
    SET_AUTH_PENDING (state) {
      state.auth.pending = true
    },
    UNSET_AUTH_PENDING (state) {
      state.auth.pending = false
    },
    SET_AUTH_DATA_COMPLETE (state, { token, id }) {
      state.auth.id = id
      state.auth.token = token
    },
    SET_DOWNLOAD_STATUS (state, { status, aids }) {
      console.log(status, data, state)
    },
    SET_JOB_ID (state, jobId) {
      state.jobId = jobId
      state.downloadProgress = 0
    },
    SET_DOWNLOAD_PROGRESS (state, percent) {
      state.downloadProgress = percent
    },
    LOGOUT (state) {
      state.auth.token = null
      state.auth.id = null
    }
  },
  getters: {
    authenticateInProgress (state) {
      return state.auth.pending
    },
    authenticated (state) {
      return state.auth.token && state.auth.id
    },
    downloadInProgress (state) {
      return state.downloadInProgress
    },
    downloadProgress (state) {
      return state.downloadProgress
    },
    totalPhotosCount (state) {
      return state.data.localData.albums.reduce((prev, current) => {
        return current.photos_count + prev
      }, 0)
    },
    downloadComplete: (state) => state.downloadComplete,
    downloadUrl: (state) => state.downloadUrl
  }
})

export default store
