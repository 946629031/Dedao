// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store' // 引入vuex
import flexible from 'amfe-flexible' // eslint-disable-line
import normalize from 'normalize.css' // eslint-disable-line

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store, // 使用 vuex store
  components: { App },
  template: '<App/>'
})
