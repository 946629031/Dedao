<template>
  <swiper ref="mySwiper" :options="swiperOptions">
    <swiper-slide v-for="banner in banners" :key="banner">
      <img :src="banner" alt="">
    </swiper-slide>
    <div class="swiper-pagination" slot="pagination"></div>
  </swiper>
</template>

<script>
export default {
  name: 'HomeSwiper',
  props: ['banners'],
  data () {
    return {
      swiperOptions: {
        loop: true,
        pagination: {
          el: '.swiper-pagination'
        }
        // Some Swiper option/callback...
      }
    }
  },
  computed: {
    swiper () {
      return this.$refs.mySwiper.$swiper
    }
  },
  mounted () {
    // console.log('Current Swiper instance object', this.swiper)
    this.swiper.slideTo(1, 1000, false)
  }
}
</script>

<style lang="stylus" scoped>
.swiper-container >>> .swiper-pagination-bullet-active
  background-color #ffffff
.swiper-container >>> .swiper-pagination-bullet
  width 10px
  height 2px
  border-radius 0

.swiper-container
  margin 10px 0

  .swiper-slide:after
    content ''
    display block
    margin-top 33%

  .swiper-slide
    position relative
    img
      width 100%
      position absolute
      top 0
</style>
