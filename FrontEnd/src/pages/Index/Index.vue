<template>
  <div id="index">
    <search></search>
    <swiper :banners='banners'></swiper>
    <icons :icons='icons'></icons>

    <div class="card">
      <ul v-if='this.list'>
        <li v-for="(item) of this.list" :key="item.id">
          <router-link :to="'/player/' + item.id">{{item.name}}</router-link>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
import Axios from 'axios'
import Search from './components/Search'
import Swiper from './components/Swiper'
import Icons from './components/Icons'

export default {
  name: 'Index',
  components: {
    Search,
    Swiper,
    Icons
  },
  data () {
    return {
      list: null,
      banners: null,
      icons: null
    }
  },
  mounted () {
    Axios.get('http://111.229.237.104:3308/api/data/index.json')
      .then(data => {
        console.log(data)
        this.list = data.data.data.course
        this.banners = data.data.data.banners
        this.icons = data.data.data.icons
      })
  }
}
</script>

<style lang="stylus" scoped>

#index
  background #f8f8f8
  height 100vh
  // padding 10px

  a
    font-size 16px
    display block
    line-height .42rem

  .card
    border-radius .04rem
    background #fff
    padding 0 .1rem
    margin 0 .1rem
</style>
