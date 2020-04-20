<template>
  <div>
    <!-- src="http://localhost:3308/music.mp3" -->
    <!-- src="https://m10.music.126.net/20200418173352/27c6d61b1483c92c5a9249ccb29f2220/ymusic/c967/f2b7/691f/b53842874406c8afc883928d647459eb.mp3" -->
    <audio ref="audio"
      @pause="onPause"
      @play="onPlay"
      @timeupdate="onTimeupdate"
      @loadedmetadata="onLoadedmetadata"
      src="http://m10.music.126.net/20200420104455/18572d51641147812de97865caa9dcc7/ymusic/d605/00d2/9ab8/26f7b290859a3bfad643ef28be54bf84.mp3"
      style="display: none"
      meted="meted"
      controls="controls"></audio>

    <div class="title" v-if="this.$store.state.currentPlay && this.$store.state.currentPlay.url">{{this.$store.state.currentPlay.title}}</div>
    <!-- 音频播放控件 -->
    <div class="controls_wrapper">
      <!-- 滑块 -->
      <div class="slider_wrapper">
        <el-tag type="info">{{ audio.currentTime | formatSecond}}</el-tag>

          <!-- 进度条 -->
          <el-slider v-model="sliderTime" :format-tooltip="formatProcessToolTip" @change="changeCurrentTime" class="slider"></el-slider>

        <el-tag type="info">{{ audio.maxTime | formatSecond}}</el-tag>
      </div>

      <!-- 播放按钮 -->
      <div class="button_wrapper">
        <svg class="icon previous" aria-hidden="true"> <use xlink:href="#icon-zuofan"></use> </svg>
        <!-- <el-button type="text" @click="startPlayOrPause">{{audio.playing | transPlayPause}}</el-button> -->
        <div @click="startPlayOrPause">
          <svg v-if="this.audio.playing" class="icon" aria-hidden="true"> <use xlink:href="#icon-bofang"></use> </svg>
          <svg v-else class="icon" aria-hidden="true"> <use xlink:href="#icon-zanting"></use> </svg>
        </div>
        <svg class="icon next" aria-hidden="true"> <use xlink:href="#icon-youfanye"></use> </svg>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      sliderTime: null,
      url: '123.mp3',
      audio: {
        // 该字段是音频是否处于播放状态的属性
        playing: false
      },
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
        // url: 'http://localhost:3308/' + this.$store.state.currentPlay.url,
        url: 'http://localhost:3308/uploadFile/' + this.$store.state.currentPlay.url,
        pic: this.$store.state.currentPlay.pic,
        lrc: this.$store.state.currentPlay.lrc
      }
      // 如果点击了列表，当前播放文件被改变，则重新赋值 并播放
      this.$refs.audio.setAttribute('src', 'http://localhost:3308/uploadFile/' + this.$store.state.currentPlay.url)
      this.$refs.audio.play()
    }
  },
  methods: {
    // 控制音频的播放与暂停
    startPlayOrPause () {
      return this.audio.playing ? this.pause() : this.play()
    },
    play () { // 播放音频
      // this.$refs.audio.setAttribute('src', 'http://m10.music.126.net/20200420164512/b3236c01e18edcde39c6e28c405f43a9/ymusic/d605/00d2/9ab8/26f7b290859a3bfad643ef28be54bf84.mp3')
      this.$refs.audio.play()
    },
    pause () { // 暂停音频
      this.$refs.audio.pause()
    },
    onPlay () { // 当音频播放
      this.audio.playing = true
    },
    onPause () { // 当音频暂停
      this.audio.playing = false
    },
    // 当加载语音流元数据完成后，会触发该事件的回调函数
    // 语音元数据主要是语音的长度之类的数据
    onLoadedmetadata (res) {
      // console.log('loadedmetadata')
      // console.log(res)
      this.audio.maxTime = parseInt(res.target.duration)
    },
    // 当timeupdate事件大概每秒一次，用来更新音频流的当前播放时间
    // 当音频当前时间改变后，进度条也要改变
    onTimeupdate (res) {
      // console.log('timeupdate')
      // console.log(res)
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
    // // 使用组件过滤器来动态改变按钮的显示
    // transPlayPause (value) {
    //   return value ? '暂停' : '播放'
    // },
    // 将整数转化成时分秒
    formatSecond (second = 0) {
      return realFormatSecond(second)
    }
  }
}

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
</script>

<style lang="stylus" scoped>
.title
  font-size 18px
  padding 20px
  box-sizing border-box
.controls_wrapper
  margin-top 20px
  .slider_wrapper
    display flex
    .slider
      flex 1
    .el-tag
      margin 0 20px
  .button_wrapper
    text-align center
    align-items center
    display flex
    justify-content space-around
    padding 30px 0
    .icon
      width 60px
      height 60px
    .previous, .next
      width 30px
      height 30px
</style>
