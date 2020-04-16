import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/Index/Index'
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
      path: '/upload',
      name: 'Upload',
      component: Upload
    }
  ]
})
