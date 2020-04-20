// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store' // 引入vuex
import flexible from 'amfe-flexible' // eslint-disable-line
import normalize from 'normalize.css' // eslint-disable-line
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/styles/iconfont/iconfont.css'
import '@/assets/styles/iconfont/iconfont.js'

Vue.config.productionTip = false
Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store, // 使用 vuex store
  components: { App },
  template: '<App/>'
})
