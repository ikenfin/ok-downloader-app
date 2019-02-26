// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import resource from 'vue-resource'

import store from './store'

Vue.config.productionTip = false
Vue.use(resource)

const token = localStorage.getItem('okd-token')
if (token) {
  Vue.http.headers.common['Authorization'] = token
}
// else {
//   window.location = '/'
// }

/* eslint-disable no-new */
new Vue({
  el: '#ok-download-app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
