<template>
  <div>
    <!-- 用原生方式，手写一个音乐播放器
         参考文件：https://github.com/wangduanduan/element-audio -->

    <!-- src="http://localhost:3308/music.mp3" -->
    <!-- src="https://m10.music.126.net/20200417183756/71925ecc940131929e46426e050a8f41/ymusic/c967/f2b7/691f/b53842874406c8afc883928d647459eb.mp3" -->
    <audio
    ref="audio"
    @play='onPlay'
    @pause='onPause'
    @timeupdate='onTimeupdate'
    @loadedmetadata='onLoadedmetadata'
    src="https://m10.music.126.net/20200418155835/4f44aaac40a78bf5d93a895cd69a3a80/ymusic/c967/f2b7/691f/b53842874406c8afc883928d647459eb.mp3"
     controls="controls"></audio>

    <div>{{ this.audio.currentTime | formatSecond}}</div>
    <div>{{ this.audio.maxTime | formatSecond}}</div>

    <!-- 进度条 -->
    <slider @changeRate='handleChangeRate'
      :currentTime='this.audio.currentTime'
      :maxTime='this.audio.maxTime'></slider>

    <div @click="startPlayOrPause">{{ audio.playing | transPlayPause }}</div>
  </div>
</template>

<script>
import Slider from './components/Slider'

export default {
  name: 'demo',
  components: {
    Slider
  },
  data () {
    return {
      audio: {
        playing: false, // 该字段是音频是否处于播放状态的属性
        currentTime: null,
        maxTime: null
      },
      sliderTime: null
    }
  },
  methods: {
    play () {
      this.$refs.audio.play()
    },
    pause () {
      this.$refs.audio.pause()
    },
    startPlayOrPause () {
      return this.audio.playing ? this.pause() : this.play()
    },
    onPlay () {
      this.audio.playing = true
    },
    onPause () {
      this.audio.playing = false
    },
    // 当加载语音流元数据完成后，会触发该事件的回调函数
    // 语音元数据主要是语音的长度之类的数据
    onLoadedmetadata (res) {
      console.log('onLoadedmetadata', res.target.duration)
      this.audio.maxTime = parseInt(res.target.duration)
    },
    // 当timeupdate事件大概每秒一次，用来更新音频流的当前播放时间
    onTimeupdate (res) {
      this.audio.currentTime = res.target.currentTime
      this.sliderTime = parseInt(res.target.currentTime / this.audio.maxTime * 100) // 当音频当前时间改变后，进度条也要改变
      console.log('this.sliderTime ' + this.sliderTime)
    },
    handleChangeRate (rate) { // 响应进度条被改变，从而改变音乐时间
      let currentTime = this.audio.maxTime * rate / 100
      this.$refs.audio.currentTime = currentTime
    }
  },
  filters: {
    // 使用组件过滤器来动态改变按钮的显示
    transPlayPause (value) {
      return value ? '暂停' : '开始'
    },
    formatSecond (second = 0) {
      return realFormatSecond(second)
    }
  }
}

function realFormatSecond (second) {
  let secondType = typeof second

  if (secondType === 'string' || secondType === 'number') {
    second = parseInt(second)

    let hours = Math.floor(second / 3600)
    second = second - hours * 3600
    let minute = Math.floor(second / 60)
    second = second - minute * 60

    // console.log('minute ', `${hours}:${minute}:${second}`)
    return hours + ':' + ('0' + minute).slice(-2) + ':' + ('0' + second).slice(-2)
  } else {
    return '0:00:00'
  }
}
</script>

<style scoped>

</style>
