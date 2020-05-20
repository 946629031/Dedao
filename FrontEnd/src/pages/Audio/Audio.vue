<template>
  <div>
    <!-- <div v-if="this.audio">{{audio}}</div>
    <div v-if="this.audio.maxTime">{{maxTime}} : {{maxTime.target}} : {{maxTime.target.duration}}</div> -->
    <audio ref="audio"
      @pause="onPause"
      @play="onPlay"
      @timeupdate="onTimeupdate"
      @loadedmetadata="onLoadedmetadata"
      src=""
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

        <div class="forback" @click="changePlaybackTime">
          <div class="text">5s</div>
          <svg class="icon forback-icon" aria-hidden="true"> <use xlink:href="#icon-xiangzuoxuanzhuan"></use> </svg>
        </div>

        <div @click="startPlayOrPause">
          <svg v-if="this.audio.playing" class="icon" aria-hidden="true"> <use xlink:href="#icon-bofang"></use> </svg>
          <svg v-else class="icon" aria-hidden="true"> <use xlink:href="#icon-zanting"></use> </svg>
        </div>

        <div class="forward" @click="changePlayForwardTime">
          <div class="text">5s</div>
          <svg class="icon forback-icon" aria-hidden="true"> <use xlink:href="#icon-xiangyouxuanzhuan"></use> </svg>
        </div>

        <svg class="icon next" aria-hidden="true"> <use xlink:href="#icon-youfanye"></use> </svg>
      </div>

      <div class="changePlaybackRate">
        <div @click="showPlaybackRate()">倍速</div>
        <div :style="{ display: showChangePlaybackRate }">
          <ul>
            <li @click="changePlaybackRate(0.5)">0.5</li>
            <li @click="changePlaybackRate(1)">1</li>
            <li @click="changePlaybackRate(1.5)">1.5</li>
            <li @click="changePlaybackRate(2)">2</li>
            <li @click="changePlaybackRate(2.5)">2.5</li>
            <li @click="changePlaybackRate(3)">3</li>
          </ul>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      maxTime: '',
      sliderTime: null,
      url: '123.mp3',
      audio: {
        playing: false,
        maxTime: null,
        currentTime: null
      },
      currentPlay: {
        autoplay: false,
                              // eslint-disable-line
        title: null,
        author: null,
        url: null,
        pic: null,
        lrc: null
      },
      showChangePlaybackRate: 'none'
    }
  },
  computed: {
    getCurrentPlay () {
      return this.$store.state.currentPlay
    }
  },
  watch: {
    getCurrentPlay () {
      this.audio.playing = false

      this.currentPlay = {
        title: this.$store.state.currentPlay.title,
        author: this.$store.state.currentPlay.author,
        url: 'http://111.229.237.104:3308/uploadFile/' + this.$store.state.currentPlay.url,
        pic: this.$store.state.currentPlay.pic,
        lrc: this.$store.state.currentPlay.lrc
      }
      // 如果点击了列表，当前播放文件被改变，则重新赋值 并播放
      this.$refs.audio.setAttribute('src', 'http://111.229.237.104:3308/uploadFile/' + this.$store.state.currentPlay.url)
      // this.$refs.audio.setAttribute('src', 'http://m701.music.126.net/20200513111319/373963af96443e8e158610808a29f846/jdymusic/obj/w5zDlMODwrDDiGjCn8Ky/2092528571/bc9f/12d5/476d/860d5694d870aca1fc7ae978037228d8.mp3')
      // this.$refs.audio.setAttribute('src', 'http://www.w3school.com.cn/i/song.mp3')
      // this.$refs.audio.play() //  Safari 浏览器不允许自动播放，违反用户意愿
    }
  },
  methods: {
    // 控制音频的播放与暂停
    startPlayOrPause () {
      return this.audio.playing ? this.pause() : this.play()
    },
    play () { // 播放音频
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
      this.maxTime = res
      this.audio.maxTime = parseInt(res.target.duration)
    },
    // 当timeupdate事件大概每秒一次，用来更新音频流的当前播放时间
    // 当音频当前时间改变后，进度条也要改变
    onTimeupdate (res) {
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
    },
    changePlaybackRate (rate) {
      document.querySelector('audio').playbackRate = rate
    },
    showPlaybackRate () {
      this.showChangePlaybackRate = this.showChangePlaybackRate === 'block' ? 'none' : 'block'
    },
    changePlaybackTime () {
      document.querySelector('audio').currentTime -= 5
    },
    changePlayForwardTime () {
      document.querySelector('audio').currentTime += 5
    }
  },
  filters: {
    // 使用组件过滤器来动态改变按钮的显示
    formatSecond (second = 0) { // 将整数转化成时分秒
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

    .forback, .forward
      color #ff9d4d
      position relative
      height 40px
      width 40px
      .text
        font-size 12px
        line-height 40px
        position absolute
        left 0
        right 0
        top 0
        bottom 0
      .icon
        height 30px
        width 30px
        padding 5px

    .icon
      width 60px
      height 60px
    .previous, .next
      width 30px
      height 30px

  .changePlaybackRate
    font-size 16px

    div
      padding 20px
      // position fixed
      // bottom 0

      li
        line-height 2.5
        border-top 1px solid #efefef
</style>
