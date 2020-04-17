<template>
  <div class="di main-wrap" >
    <!-- 这里设置了ref属性后，在vue组件中，就可以用this.$refs.audio来访问该dom元素 -->
    <audio ref="audio" class="dn"
      :src="url" :preload="audio.preload"
      @play="onPlay"
      @error="onError"
      @waiting="onWaiting"
      @pause="onPause"
      @timeupdate="onTimeupdate"
      @loadedmetadata="onLoadedmetadata"
    ></audio>

    <div >
      <!-- 倍率播放速度 -->
      <!-- <el-button v-show="!controlList.noSpeed" type="text" @click="changeSpeed">{{audio.speed | transSpeed}}</el-button> -->
        <div class="boxs">
            <div class="track">
            <!-- <el-tag type="info">{{ audio.currentTime | formatSecond}}</el-tag> -->
                <div class="times startT">{{ audio.currentTime | formatSecond}} </div>
                <div class="sliders-box">
                    <el-slider v-show="!controlList.noProcess" v-model="sliderTime" :format-tooltip="formatProcessToolTip" @change="changeCurrentTime" class="slider"></el-slider>
                </div>
                <div class="times endT">
                    {{ audio.maxTime | formatSecond }}
                </div>
                <!-- <el-tag type="info">{{ audio.maxTime | formatSecond }}</el-tag> -->
            </div>
        </div>
        <div class="operation">
            <div class="back-box" @click="minus">
                <!-- <img src="../assets/img/back_15.png" width="100%" alt=""> -->
                back
            </div>
            <div class="play-bt"  @click="startPlayOrPause">
                <img :src="audio.playing | transPlayPause" width="100%" alt="">
            </div>
            <!-- <el-button type="text" @click="startPlayOrPause">{{audio.playing | transPlayPause}}</el-button> -->
            <div class="forward" @click="add">
                <!-- <img src="../assets/img/forward_15.png" width="100%" alt=""> -->
                forward
            </div>
        </div>
      <!-- <el-button v-show="!controlList.noMuted" type="text" @click="startMutedOrNot">{{audio.muted | transMutedOrNot}}</el-button> -->
      <!-- <el-slider v-show="!controlList.noVolume" v-model="volume" :format-tooltip="formatVolumeToolTip" @change="changeVolume" class="slider"></el-slider> -->
      <!-- <a :href="url" v-show="!controlList.noDownload" target="_blank" class="download" download>下载</a> -->
    </div>
  </div>
</template>

<script>
function realFormatSecond (second) {
  var secondType = typeof second

  if (secondType === 'number' || secondType === 'string') {
    second = parseInt(second)

    var hours = Math.floor(second / 3600)
    second = second - hours * 3600
    var mimute = Math.floor(second / 60)
    second = second - mimute * 60

    // return hours + ':' + ('0' + mimute).slice(-2) + ':' + ('0' + second).slice(-2)
    return ('0' + mimute).slice(-2) + ':' + ('0' + second).slice(-2)
  } else {
    return '00:00'
  }
}

export default {
  props: {
    theUrl: {
      type: String,
      required: true,
    },
    theSpeeds: {
      type: Array,
      default () {
        return [1, 1.5, 2]
      }
    },
    theControlList: {
      type: String,
      default: ''
    }
  },
  name: 'VueAudio',
  data () {
    return {
      L: 0,
      url: this.theUrl || 'http://devtest.qiniudn.com/secret base~.mp3',
      audio: {
        currentTime: 0,
        maxTime: 0,
        playing: false,  // 是否自动播放
        muted: false,   // 是否静音
        speed: 1,
        waiting: true,
        preload: 'auto'
      },

      sliderTime: 0,
      volume: 100,
      speeds: this.theSpeeds,

      controlList: {
        // 不显示下载
        noDownload: false,
        // 不显示静音
        noMuted: false,
        // 不显示音量条
        noVolume: false,
        // 不显示进度条
        noProcess: false,
        // 只能播放一个
        onlyOnePlaying: false,
        // 不要快进按钮
        noSpeed: false
      }
    }
  },
  methods: {
    setControlList () {
      let controlList = this.theControlList.split(' ')
      controlList.forEach((item) => {
        // console.log(this.controlList[item]);
        if (this.controlList[item] !== undefined) {
          this.controlList[item] = true
        }
      })
    },
    changeSpeed () {
      let index = this.speeds.indexOf(this.audio.speed) + 1
      this.audio.speed = this.speeds[index % this.speeds.length]
      this.$refs.audio.playbackRate = this.audio.speed
    },
    startMutedOrNot () {
      this.$refs.audio.muted = !this.$refs.audio.muted
      this.audio.muted = this.$refs.audio.muted
    },
    // 音量条toolTip
    formatVolumeToolTip (index) {
      return '音量条: ' + index
    },
    // 进度条toolTip
    formatProcessToolTip (index = 0) {
      index = parseInt(this.audio.maxTime / 100 * index)
      return '进度条: ' + realFormatSecond(index)
    },
    // 音量改变
    changeVolume (index = 0) {
      this.$refs.audio.volume = index / 100
      this.volume = index
    },
    // 播放跳转
    changeCurrentTime (index) {
      this.$refs.audio.currentTime = parseInt(index / 100 * this.audio.maxTime)
    },
    startPlayOrPause () {
      return this.audio.playing ? this.pausePlay() : this.startPlay()
    },
    // 开始播放
    startPlay () {
      this.$refs.audio.play()
    },
    // 暂停
    pausePlay () {
      this.$refs.audio.pause()
    },
    // 当音频暂停
    onPause () {
      this.audio.playing = false
    },
    // 当发生错误, 就出现loading状态
    onError () {
      this.audio.waiting = true
    },
    // 当音频开始等待
    onWaiting (res) {
      console.log(res)
    },
    // 当音频开始播放
    onPlay (res) {
      // console.log(res)
      this.audio.playing = true
      this.audio.loading = false

      if (!this.controlList.onlyOnePlaying) {
        return
      }

      let target = res.target

      let audios = document.getElementsByTagName('audio');

      [...audios].forEach((item) => {
        if (item !== target) {
          item.pause()
        }
      })
    },
    // 当timeupdate事件大概每秒一次，用来更新音频流的当前播放时间
    onTimeupdate (res) {
      // console.log('timeupdate')
      // console.log(res)
      this.audio.currentTime = res.target.currentTime
      this.sliderTime = parseInt(this.audio.currentTime / this.audio.maxTime * 100)
    },
    // 当加载语音流元数据完成后，会触发该事件的回调函数
    // 语音元数据主要是语音的长度之类的数据
    onLoadedmetadata (res) {
      console.log('loadedmetadata')
      console.log(res)
      this.audio.waiting = false
      this.audio.maxTime = parseInt(res.target.duration)
      // this.audio.maxTime = parseInt( this.$refs.audio.duration)
      console.log('总时间',this.$refs.audio.duration)
      this.$emit('loading-true', 11)
    },
    add () {
      //前进15s
      let current_t = parseInt(this.$refs.audio.currentTime)
      let total_t = parseInt( this.$refs.audio.duration)
      //console.log(this.$refs.audio)
      this.$refs.audio.currentTime = (current_t + 15) >= total_t ? total_t : ( current_t + 15 )
      console.log(current_t, total_t, this.$refs.audio.currentTime)
      // console.log(this.$refs.audio.played)
      
    },
    minus () {
      // 后退15秒
      let current_t = parseInt(this.$refs.audio.currentTime)
      this.$refs.audio.currentTime = (current_t - 15) <= 0 ? 0 : ( current_t - 15 )
    }
  },
  filters: {
    formatSecond (second = 0) {
      return realFormatSecond(second)
    },
    transPlayPause (value) {
      // console.log(value);
      // return value ? require("../assets/img/pause.png") : require("../assets/img/play.png")
    },
    transMutedOrNot (value) {
      return value ? '放音' : '静音'
    },
    transSpeed (value) {
      return '快进: x' + value
    }
  },
  watch: {
    url (val,oldval) {
      console.log(val, oldval)
    },
    sliderTime (val, oldval) {
      // console.log(val,oldval)
      if (val >= 98) {
        this.L = 98
        return
      }
      this.L = val
    }
  },
  created () {
    // let audio = new Audio();
    // audio.src = this.url; //audio链接
    // audio.addEventListener('loadedmetadata', function() {
    //     console.log(audio.duration);
    //     //
    // });
    this.setControlList()
  }
  
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.boxs{
    display: flex;
    justify-content: center
}
.track{
    background: #81e0b2;
    border-radius:20px;
    height: 40px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    box-sizing: border-box;
    width: 548px;
    
}

.times{
    color:#fff
}
.startT{
    padding: 0 15px;
    font-size: 24px;
}
.endT{padding: 0 15px; font-size: 24px;}
.operation{

    margin-top: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.play-bt{
    font-size: 0;
    width: 76px;
    height: 75px;
}
.back-box{
    margin-right: 50px;
}
.forward {
    margin-left: 50px;
}
.back-box,.forward{
    font-size: 0;
    width: 47px;
    height: 46px;
    
}
.sliders-box{
    width: 400px;
    display: flex;
    justify-content: center;
    align-items:center;
}
.slider >>> .el-slider__runway{
    /* height: 100%; */
}
.slider >>> .el-slider__button-wrapper {
  position: absolute;
  top: -45px;
 
}
.slider >>> .el-slider__button {
   width: 51px;
  height: 59px;
  border:none;
  border-radius: inherit;
  /* background: url(../assets/img/fubiao.gif) no-repeat center; */
  background-size: cover;
}
.slider >>> .el-slider__bar{background: #3abd83;} 
.div_box{
  height: 100px;
  position: relative;
}
.div0{width: 10px;height: 10px;border-radius: 5px;background: red;position: absolute;top: 0;}
  .main-wrap{
    padding: 10px 15px;
  }
  .slider {
    display: inline-block;
    width:100%;
    position: relative;
    margin-left: 15px;
  }

  /* .di {
    display: inline-block;
  } */

  .download {
    color: #409EFF;
    margin-left: 15px;
  }

  .dn{
    display: none;
  }

</style>

