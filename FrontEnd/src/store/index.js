import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex) // 通过 Vue.use() 来使用插件

export default new Vuex.Store({
  state: {
    playStatus: false, // 是否正在播放
    currentPlay: null,
    allList: null
  },
  mutations: {
    getAllList (state, list) {
      state.allList = list
      state.currentPlay = list[0]
    },
    changeCurrentPlay (state, data) {
      state.currentPlay = data
      state.playStatus = true
    }
  }
})
