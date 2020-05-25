<template>
  <div id="search">
    <div class="search_area">
      <svg class="icon search_icon" aria-hidden="true"> <use xlink:href="#icon-sousuo"></use> </svg>
      <input class="search_input" type="text" placeholder="阅读与写作">
    </div>
    <svg class="icon letter" aria-hidden="true"> <use xlink:href="#icon-linedesign-03"></use> </svg>
  </div>
</template>

<script>
export default {
  name: 'Search'
}
</script>

<style lang="stylus" scoped>
#search
  display flex
  align-items center

  .search_area
    background #f0f0f0
    display flex
    border-radius 6px
    width 100%

    .search_icon
      padding 4px 10px

  .search_input
    width 100%
    border 0
    box-shadow none
    outline none
    margin 4px 0
    height 40px
    background #f0f0f0
    padding-left 0

  .letter
    padding 6px 10px
</style>
