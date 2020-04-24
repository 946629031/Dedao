<template>
  <div id="playList">
    <div v-for="(item, index) of this.list" :key='index' @click="changePlay(item)">
      <div>{{item.title}}</div>
    </div>
    <!-- <ul>
      <li v-for="(item, index) of this.list" :key='index' @click="changePlay(item)">
        <div>{{item.title}}</div>
      </li>
    </ul> -->
  </div>
</template>

<script>
export default {
  name: 'list',
  data () {
    return {
      list: this.getAllList
    }
  },
  watch: {
    getAllList () {
      this.list = this.getAllList
      // console.log(this.list)
    }
  },
  computed: {
    getAllList () {
      return this.$store.state.allList
    }
  },
  methods: {
    changePlay (item) {
      this.$store.commit('changeCurrentPlay', item)
      document.querySelector('audio').play()
    }
  }
}
</script>

<style scoped>
#playList {
  font-size: 16px;
}
</style>
