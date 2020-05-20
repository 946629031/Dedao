<template>
  <div>
    <div @click="changePlaybackTime">退15s</div>
    <div @click="changePlaybackRate">倍速</div>
    <div @click="changePlayForwardTime">进15s</div>
  </div>
</template>

<script>
export default {
  name: 'Controller',
  methods: {
    changePlaybackRate () {
      document.querySelector('audio').playbackRate = 2
    },
    changePlaybackTime () {
      document.querySelector('audio').currentTime -= 5
    },
    changePlayForwardTime () {
      document.querySelector('audio').currentTime += 5
    }
  }
}
</script>

<style scoped>

</style>
