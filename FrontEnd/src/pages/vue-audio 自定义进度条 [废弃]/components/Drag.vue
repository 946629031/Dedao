<template>
  <div class="drag"
    ref="drag"
    @mousedown="onMousedown"
    @mousemove="onMousemove"
    @mouseleave='onMouseleave'
    @mouseup="onMouseup"
  ></div>
</template>

<script>
// 本模块为：进度条上的拖拽圆点模块

let click = false // 是否按下鼠标的标记
let cur = {       // 记录鼠标按下时的坐标
  x: 0,
  y: 0
}
var nx, ny, divX, divY, x, y

let down = (e, $refs) => {
  click = true
  cur.x = e.clientX // 记录按下时鼠标的x坐标
  cur.y = e.clientY // 记录按下时鼠标的y坐标
  divX = $refs.drag.offsetLeft // 记录按下时div的左偏移量
  divY = $refs.drag.offsetTop // 记录按下时div的上偏移量
}
let move = (e, $refs) => {
  if (click) {
    /*
       e.clientX 为鼠标实时位置
       cur.x 为鼠标按下时的位置
    */

    // 解决方案一
    // -10px 是为了让鼠标的中心，位于div的中心，以至于可以左右移动
    $refs.drag.style.left = e.clientX - 10 + 'px'
    console.log(e.clientX - 10 + 'px')

    // 解决方案二
    // x = divX + e.clientX - cur.x
    // $refs.drag.style.left = x + 'px'
  }
}
let end = (e, $refs) => {
  click = false
}

export default {
  name: 'Drag',
  methods: {
    onMousedown (e) {
      down(e, this.$refs)
    },
    onMousemove (e) {
      move(e, this.$refs)
    },
    onMouseup (e) {
      end(e)
    },
    onMouseleave (e) {
      // console.log(e, e.clientX)
      console.log('鼠标离开了')
      // console.log(e, this.$refs)
      // let $refs = this.$refs

      // let Interval = setInterval((e, $refs) => {
      //   if (click) {
      //     move(e, $refs)
      //   } else {
      //     clearInterval(Interval)
      //   }
      // }, 1)
    }
  }
}
</script>

<style scoped>
.drag{
  width: 20px;
  height: 20px;
  border-radius: 50px;
  border: 2px solid #409EFF;;
  background: #fff;;
  position: absolute;
  left: 0;
  top: -10px;
}
</style>
