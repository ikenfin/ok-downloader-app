import Vue from 'vue'
import Router from 'vue-router'
import PhotoApp from '@/components/PhotoApp'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'PhotoApp',
      component: PhotoApp
    }
  ]
})
