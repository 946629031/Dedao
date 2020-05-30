<template>
  <div>
    <div id="index_icons" v-if="icons">
      <div class="main_icons">
        <div class="item" v-for="(item, index) of icons.main_icons" :key="index">
          <div class="img_wrapper">
            <img :src="item.img" alt="">
          </div>
          <div>{{item.name}}</div>
        </div>
      </div>
      <div class="second_icons">
        <div class="item" v-for="(item, index) of icons.second_icons" :key="index">
          <div class="img_wrapper">
            <img :src="item.img" v-if="item.img">
            <div class="no_second_img"></div>
          </div>
          <div>{{item.name}}</div>
        </div>
      </div>
    </div>

    <!-- <div id="no_icons" v-else>
      <div class="main_icons">
        <div class="item" v-for="(item, index) of icons.main_icons" :key="index">
          <img :src="item.img" alt="">
          <div>{{item.name}}</div>
        </div>
      </div>
      <div class="second_icons">
        <div class="item" v-for="(item, index) of icons.second_icons" :key="index">
          <img :src="item.img" alt="">
          <div>{{item.name}}</div>
        </div>
      </div>
    </div> -->

  </div>
</template>

<script>
export default {
  name: 'Icons',
  props: ['icons'],
  mounted () {
    // console.log(this.icons)
  }
}
</script>

<style lang="stylus" scoped>
#index_icons
  margin 10px 0
  .main_icons
    display flex
    flex-wrap wrap
    .item
      width 20%
      width 20vw
      padding .1rem
      text-align center
      box-sizing border-box

      // &:nth-child(1) img
      //   box-shadow 5px 5px 10px #fe703f

      .img_wrapper
        width 100%
        padding-top 68.8311%
        margin-bottom .05rem
        position relative
        background #e5e5e5
        border-radius .2rem

        img
          position absolute
          top 0
          left 0
          width 100%

      div
        font-size 12px
        line-height 1.5

  .second_icons
    display flex
    flex-wrap wrap

    .item
      width 20%
      width .75rem
      text-align center
      font-size 12px
      box-sizing border-box
      padding-bottom 10px

      .img_wrapper
        width 100%
        padding-top calc(.75rem - .44rem)
        position relative
        padding-bottom .05rem

        .no_second_img
          background #e5e5e5
          padding-top .31rem
          width .31rem
          margin 0 calc((20vw - .31rem) / 2)
          border-radius .1505rem
          position absolute
          top 0
          left 0

      img
        position absolute
        top 0
        left 0
        width 100%
        padding 0 .22rem
        box-sizing border-box
        z-index 2

#no_icons
  background none
</style>
