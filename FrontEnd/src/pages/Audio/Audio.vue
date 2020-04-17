<template>
  <div>
    <!-- src="http://localhost:3308/music.mp3" -->
    <!-- src="https://m10.music.126.net/20200417142719/cb0add72945e7e508d4e4a2cbed8f43e/ymusic/c967/f2b7/691f/b53842874406c8afc883928d647459eb.mp3" -->
    <audio ref="audio"
      @pause="onPause"
      @play="onPlay"
      @timeupdate="onTimeupdate"
      @loadedmetadata="onLoadedmetadata"
    src="https://m10.music.126.net/20200417172005/773901c697ebf081890cd68f64f33778/ymusic/c967/f2b7/691f/b53842874406c8afc883928d647459eb.mp3"
      controls="controls"></audio>

    <!-- 音频播放控件 -->
    <div>
      <el-button type="text" @click="startPlayOrPause">{{audio.playing | transPlayPause}}</el-button>

      <el-tag type="info">{{ audio.currentTime | formatSecond}}</el-tag>

        <!-- 进度条ui -->
        <el-slider v-model="sliderTime" :format-tooltip="formatProcessToolTip" @change="changeCurrentTime" class="slider"></el-slider>

      <el-tag type="info">{{ audio.maxTime | formatSecond}}</el-tag>
    </div>
  </div>
</template>

<script>
// 将整数转换成 时：分：秒的格式
function realFormatSecond (second) {
  var secondType = typeof second

  if (secondType === 'number' || secondType === 'string') {
    second = parseInt(second)

    var hours = Math.floor(second / 3600)
    second = second - hours * 3600
    var mimute = Math.floor(second / 60)
    second = second - mimute * 60

    return hours + ':' + ('0' + mimute).slice(-2) + ':' + ('0' + second).slice(-2)
  } else {
    return '0:00:00'
  }
}

export default {
  data () {
    return {
      sliderTime: null,
      audio: {
        // 该字段是音频是否处于播放状态的属性
        playing: false
      }
    }
  },
  methods: {
    // 控制音频的播放与暂停
    startPlayOrPause () {
      return this.audio.playing ? this.pause() : this.play()
    },
    // 播放音频
    play () {
      this.$refs.audio.play()
    },
    // 暂停音频
    pause () {
      this.$refs.audio.pause()
    },
    // 当音频播放
    onPlay () {
      this.audio.playing = true
    },
    // 当音频暂停
    onPause () {
      this.audio.playing = false
    },
    // 当加载语音流元数据完成后，会触发该事件的回调函数
    // 语音元数据主要是语音的长度之类的数据
    onLoadedmetadata (res) {
      console.log('loadedmetadata')
      console.log(res)
      this.audio.maxTime = parseInt(res.target.duration)
    },
    // 当timeupdate事件大概每秒一次，用来更新音频流的当前播放时间
    // 当音频当前时间改变后，进度条也要改变
    onTimeupdate (res) {
      console.log('timeupdate')
      console.log(res)
      this.audio.currentTime = res.target.currentTime
      this.sliderTime = parseInt(this.audio.currentTime / this.audio.maxTime * 100)
    },
    // 拖动进度条，改变当前时间，index是进度条改变时的回调函数的参数0-100之间，需要换算成实际时间
    changeCurrentTime (index) {
      this.$refs.audio.currentTime = parseInt(index / 100 * this.audio.maxTime)
    },
    // 进度条格式化toolTip
    formatProcessToolTip (index = 0) {
      index = parseInt(this.audio.maxTime / 100 * index)
      return '进度条: ' + realFormatSecond(index)
    }
  },
  filters: {
    // 使用组件过滤器来动态改变按钮的显示
    transPlayPause (value) {
      return value ? '暂停' : '播放'
    },
    // 将整数转化成时分秒
    formatSecond (second = 0) {
      return realFormatSecond(second)
    }
  }
}
</script>

<style>

</style>
