import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/Index/Index'
import Player from '@/pages/Player/Index'
import Upload from '@/pages/Upload/Upload'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/player/:id',
      name: 'Player',
      component: Player
    },
    {
      path: '/upload',
      name: 'Upload',
      component: Upload
    }
  ]
})
