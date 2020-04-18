# music

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

----

## 参考文档
- [网易云音乐真实链接获取](https://jinchidong.com/2019/03/19/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E7%9C%9F%E5%AE%9E%E9%93%BE%E6%8E%A5%E8%8E%B7%E5%8F%96/)

## 开发日志
- 2020年4月16日
    - 由于之前使用[【vue-aplayer】](https://github.com/SevenOutman/vue-aplayer/blob/develop/docs/README.zh-CN.md) 的效果并不满意
        - 原因是 vue-aplayer 没有理想的播放控件
- 2020年4月17日
    - [教你如何实现一个简单的音乐播放器 - 【element-audio github】](https://github.com/wangduanduan/element-audio)
- 2020年4月18日
    - 1.目的：自己着手实现 【进度条功能】
    - 2.结果：实现了 点击进度条改变 音乐播放进度
    - 3.在实现 以拖拽的方式，改变音乐进度时
        - 1.遇到问题
            - 鼠标在div内移动时，可以实现
            - 鼠标在div外移动，需要也能改变进度，就实现不了了
                - 为了良好的用户体验，自然的拖拽习惯
        - 2.找的相关解决方案：
            - 音乐播放器 如何实现 进度条的拖拽功能
                - [《 js实现一个可以兼容PC端和移动端的div拖动效果》](https://blog.csdn.net/u014346301/article/details/53536714)
                - [鼠标事件以及clientX、offsetX、screenX、pageX、x的区别](https://blog.csdn.net/weixin_41342585/article/details/80659736)
        - 在问题中，再次遇到问题
            - 问题描述:
                - 当鼠标拖拽时，如果鼠标坐标 div 内，还是能够实现效果的
                - 但是，当鼠标拖拽时，鼠标坐标离开了 被拖拽的div 就不能实现div拖拽效果了
                - 后面看到了下面 [《Element源码分析系列10 - Slider(滑块)》](https://juejin.im/post/5b87bdf36fb9a01a0058bed1)的源码时，决定放弃自己实现，转而使用 Element 的代码
        - 3.在看到下面这篇文章的时候，决定放弃自己实现，因为真的太复杂了~~~~~
            - [Element源码分析系列10 - Slider(滑块)](https://juejin.im/post/5b87bdf36fb9a01a0058bed1)
            - 不止于复杂，如果要自己开发好，且有良好的兼容效果，需要花费的精力太多了
    - 4.代码位置
        ```
        /src/pages/vue-audio

        |- vue-audio  为自己开发的进度条组件
           |- components
             |- Drag.vue    滑块
             |- Slider.vue  进度条
           |- demo.vue
        ```