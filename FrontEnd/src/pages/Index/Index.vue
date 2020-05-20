<template>
  <div>
    <div class="post"></div>
    <aaudio></aaudio>
    <!-- <vue-aplayer autoplay  ref="player" :music="{
      title: '发刊词｜美国人为什么那样想？',
      author: 'Hans Zimmer/Richard Harvey',
      url: 'https://m10.music.126.net/20200417105653/682a2b145706ef53b8803a271b756315/ymusic/c967/f2b7/691f/b53842874406c8afc883928d647459eb.mp3',
      pic: 'http://devtest.qiniudn.com/Preparation.jpg',
      lrc: '[00:00.00]lrc here\n[00:01.00]vue-aplayer'
    }"></vue-aplayer> -->
    <!-- <vue-aplayer v-if="this.currentPlay.url" :music="this.currentPlay" ref="player"></vue-aplayer> -->
    <list></list>
  </div>
</template>

<script>
import vueAplayer from 'vue-aplayer'
import axios from 'axios'
import List from './components/List'
import aaudio from '../Audio/Audio'

export default {
  name: 'Index',
  data () {
    return {
      currentPlay: {
        autoplay: false,
                              // eslint-disable-line
        title: null,
        author: null,
        url: null,
        pic: null,
        lrc: null
      }
    }
  },
  components: {
    vueAplayer,
    List,
    aaudio
  },
  computed: {
    getCurrentPlay () {
      return this.$store.state.currentPlay
    }
  },
  watch: {
    getCurrentPlay () {
      this.currentPlay = {
        title: this.$store.state.currentPlay.title,
        author: this.$store.state.currentPlay.author,
        url: 'http://111.229.237.104:3308/uploadFile/' + this.$store.state.currentPlay.url,
        // url: 'http://localhost:3308/uploadFile/' + this.$store.state.currentPlay.url,
        pic: this.$store.state.currentPlay.pic,
        lrc: this.$store.state.currentPlay.lrc
      }
      // setTimeout(() => {
      //   this.$refs.player.play()
      // }, 1000)
    }
  },
  mounted () {
    // axios.get('http://127.0.0.1:3308/api/data/retrieve/playList')
    axios.get('http://111.229.237.104:3308/api/data/retrieve/playList')
      .then(dataList => {
        if (dataList.data.code === 1 && dataList.data.msg === '请求成功') {
          this.$store.commit('getAllList', dataList.data.data)
        }
      })
  }
}
</script>

<style lang="stylus" scoped>
.post
  width 40vw
  height 60vw
  background-color #efefef
  border-radius 6px
  margin 10vw auto
</style>
