<template>
  <div id="index">
    <search></search>
    <swiper :banners='banners'></swiper>

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

export default {
  name: 'Index',
  components: {
    Search,
    Swiper
  },
  data () {
    return {
      list: null,
      banners: null
    }
  },
  mounted () {
    Axios.get('http://111.229.237.104:3308/api/data/index.json')
      .then(data => {
        console.log(data)
        this.list = data.data.data.course
        this.banners = data.data.data.banners
      })
  }
}
</script>

<style lang="stylus" scoped>

#index
  background #f8f8f8
  height 100vh
  padding 10px

  a
    font-size 16px
    display block
    line-height 42px

  .card
    border-radius 4px
    background #fff
    padding 0 10px
</style>
