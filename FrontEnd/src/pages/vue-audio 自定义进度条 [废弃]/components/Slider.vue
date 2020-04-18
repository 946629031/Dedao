<template>
  <div class="slider" @click="changeRate">
    <div class="slider_runway" ref="barWidth">
      <div class="slider_bar" :style="{width: sliderRunWidth}"></div>
      <drag></drag>
    </div>
  </div>
</template>

<script>
// 本模块为：进度条模块

import Drag from './Drag'

export default {
  name: 'slide',
  props: ['currentTime', 'maxTime'],
  components: { Drag },
  data () {
    return {
      sliderWidth: null,
      sliderRunWidth: 0 // 进度条当前进度
    }
  },
  mounted () {
    this.sliderWidth = this.$refs.barWidth.clientWidth // Vue 获取div 的宽度
    console.log(this.sliderWidth)
  },
  watch: {
    currentTime () {
      // 监听音乐播放进度，实时改变进度条的进度
      let rate = this.currentTime / this.maxTime * 100
      this.sliderRunWidth = rate + '%'
    }
  },
  methods: {
    changeRate (event) {
      var e = event || window.event
      // console.log({'x': e.screenX, 'y': e.screenY})

      let x = e.screenX // 获取你所点击的x坐标
      let rate = x / this.sliderWidth * 100
      this.sliderRunWidth = rate + '%'

      this.$emit('changeRate', rate)
    }
  }
}
</script>

<style scoped>
.slider_runway{
  width: 100%;
  height: 6px;
  background-color: #E4E7ED;
  position: relative;
}
.slider_bar{
  width: 50%;
  height: 100%;
  background-color: #409EFF;
}
</style>
