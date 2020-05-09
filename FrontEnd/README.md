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
- [网易云音乐真实链接获取](https://www.cnblogs.com/MirageFox/p/7995929.html)

## 开发日志
- 2020年4月16日
    - 由于之前使用[【vue-aplayer】](https://github.com/SevenOutman/vue-aplayer/blob/develop/docs/README.zh-CN.md) 的效果并不满意
        - 原因是 vue-aplayer 没有理想的播放控件
- 2020年4月17日
    - [教你如何实现一个简单的音乐播放器 - 【element-audio github】](https://github.com/wangduanduan/element-audio)
    - 这个解决方案 [存在的问题]
        - 1.在页面初始化，且加载好音乐文件的时候，不能够显示 [音乐总时长]，而是默认的 0:00:00
            - 要在点击播放后，才能显示 [音乐总时长]
        - 2.进度条的拖拽有时候不灵敏，拖拽不动
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

- 2020年5月6日
        [【it work !】如何使用远程调试在Chrome for iOS中调试问题](https://jonsadka.com/blog/how-to-debug-a-chrome-specific-bug-on-ios-using-remote-debugging)
- 2020年5月7日
    - 服务器提供 数据流式mp3 资源，以供前端可以改变音乐进度
        - 服务器添加这几行 reponse headers 代码后，就能够改变audio的播放进度了，具体原因不明
            - 参考网易云音乐
            ```json
            'Accept-Ranges': 'bytes',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Headers': 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
            ```
        ```js
        // filename:Server/router/index.js

        router.get('/uploadFile/:filename', async(ctx, next) => {
            var mp3 = path.resolve('/www/wwwroot/threeki/dedao/server-no-pm2/uploadFile/' + ctx.params.filename)

            // var mp3 = path.resolve(__dirname + '../../../../uploadFile/' + ctx.params.filename)

            if (fs.existsSync(mp3)) {
                console.log(fs.statSync(mp3).size)
                ctx.set({
                    'Content-Type': 'audio/mpeg',
                    'Content-Length': fs.statSync(mp3).size,

                    'Accept-Ranges': 'bytes',
                    'Access-Control-Allow-Credentials': true,
                    'Access-Control-Allow-Headers': 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range',
                    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
                })

                console.log('文件存在');
                const src = fs.createReadStream(mp3)
                ctx.body = src
            } else {
                ctx.body = 'error: 你所访问的文件并不存在, 路径：' + mp3
            }
        })
        ```
- 2020年5月8日-9日
    - 1.问题：发现音频不能获得 audio.maxTime
    - 2.分析:
        - 可能是 loadedmetadata 在IOS Safari 浏览器中不执行，
        - 导致 `this.audio.maxTime = parseInt(res.target.duration)` 没执行，最终没取得 audio.maxTime
    - 3.问题衍生：
        - 由于 audio.maxTime 无法获取，所以进度条功能也用不了
    - 4.问题解决过程：
        ```html
        <audio src="" controls type="audio/mpeg" preload id="bgmusic"></audio>
        <!-- <video controls="" autoplay="" name="media"><source src="http://111.229.237.104:3308/uploadFile/0.m4a" type="audio/mpeg"></video> -->
        <div id="text"> </div>
        <script>
        function forceSafariPlayAudio() {
            audioEl.load(); // iOS 9   还需要额外的 load 一下, 否则直接 play 无效
            audioEl.play(); // iOS 7/8 仅需要 play 一下
        }
        var audioEl = document.getElementById('bgmusic')

        var i = 0
        var textEl = document.getElementById('text')
        var textTXT = textEl.innnerHTML
        function setStr (str) {
            i++
            textTXT = textTXT + str + i
            textEl.innerHTML = textTXT
        }

        audioEl.addEventListener('loadstart', function() {
                console.log('loadstart');
            setStr(', loadstart')
        }, false);
        audioEl.addEventListener('loadeddata', function() {
            console.log('loadeddata');
            setStr(', loadstart')
        }, false);
        audioEl.addEventListener('loadedmetadata', function() {
            console.log('loadedmetadata');
            setStr(', loadedmetadata')
        }, false);
        audioEl.addEventListener('canplay', function() {
            console.log('canplay');
            setStr(', canplay')
        }, false);
        audioEl.addEventListener('play', function() {
            console.log('play');
            setStr(', play')
            // 当 audio 能够播放后, 移除这个事件
            window.removeEventListener('touchstart', forceSafariPlayAudio, false);
        }, false);
        audioEl.addEventListener('playing', function() {
            console.log('playing');
            setStr(', playing')
        }, false);
        audioEl.addEventListener('pause', function() {
            console.log('pause');
            setStr(', pause')
        }, false);

        // window.addEventListener('touchstart', forceSafariPlayAudio, false);

        audioEl.src = 'http://www.w3school.com.cn/i/song.mp3'
        // audioEl.src = 'http://111.229.237.104:3308/uploadFile/0.m4a'
        </script>

        ```
        - 执行结果 
            - 只是刷新，无任何操作情况下
            - macOS Chrome浏览器： `undefined, loadstart1, loadedmetadata2, loadstart3, canplay4`
            - IOS Safari:  `undefined, loadstart1, loadedmetadata2`
    - 5.结果分析：
        - 1.一开始，我以为是 loadedmetadata 在 IOS Safari 里不执行，导致的问题，然而并不是这样
        - 2.但是从这个测试结果来看，loadedmetadata 是完美执行的. 那么问题到底在哪里呢？
    - 6.得出结论:
        - 当我尝试切换 audio 源文件, 就发现了问题
        - .mp3 的文件，是能够完美获得 audio.maxTime 的
        - .m4a 虽然也是音频文件，但是对于 Safari 来说, 一个是不能获取 audio.maxTime, 一个是会显示为 **实时直播**
    - 7.总结：以后遇到音频文件，都用 .mp3 文件即可避免许多坑
    - 8.解决问题过程中，查找到的主要**文章**
        - [Javascript onloadedmetadata事件未在iOS设备上触发 【stackoverflow】](https://stackoverflow.com/questions/21189958/javascript-onloadedmetadata-event-not-firing-on-ios-devices)
        - [Fake auto play html audio in iOS Safari the right way 【github】](https://gist.github.com/aloha1003/a802d9a99a8f3dac089e22b0c7440958)
        - [克服 iOS HTML5 音频的局限 【IBM developer】](https://www.ibm.com/developerworks/cn/web/wa-ioshtml5/index.html)
            - [Audio sprite](https://www.ibm.com/developerworks/cn/web/wa-ioshtml5/index.html)
                - 使用 audio sprite 是满足移动 Safari 中多音效需求的最佳解决方案。与 CSS image sprite 类似，audio sprite 可以将所有的音频综合到一个音频流
                - 简单的 audio sprite 实现
                ```js
                // audioSprite has already been loaded using a user touch event
                var audioSprite = document.getElementById('audio');
                var spriteData = {
                    meow1: {
                        start: 0,
                        length: 1.1
                    },
                    meow2: {
                        start: 1.3,
                        length: 1.1
                    },
                    whine: {
                        start: 2.7,
                        length: 0.8
                    },
                    purr: {
                        start: 5,
                        length: 5
                    }
                };
                
                // play meow2 sprite
                audioSprite.currentTime = spriteData.meow2.start;
                audioSprite.play();
                ```
        - [Audio Sprites (and fixes for iOS) 【最详细的音频精灵 讲解】](https://remysharp.com/2010/12/23/audio-sprites)
            - iPhone不喜欢一次播放太多音频，它变得断断续续。
            - iPad一次不会播放多个音频流。在“ 音频状态-早期发现”中有关于24 Ways的一些很好的信息-可悲的是，这是在我自己发现这一点之后发布的！
            - 除非用户启动操作，否则iOS不会下载音频。
            - iOS能够播放音频之前大约有1/2秒的延迟-这是因为正在创建音频对象（在iOS中，不是HTML5）。
        - [Safari HTML5音频和视频指南 【Apple developer】](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/Device-SpecificConsiderations/Device-SpecificConsiderations.html)
        - [Audio自动播放Safari采坑 【github】](https://github.com/xiaohuazheng/twbm/issues/9)
