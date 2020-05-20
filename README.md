# 经验总结

## 问题1: Audio 音频文件，在IOS Safari 浏览器中 无法获得音频总时长 res.target.duration
- 问题原因：
- 且安装了 sox 软件 用于查看音频的元信息
    - `brew install sox`
    ```
    > soxi 01.mp3                                                                                          
    
    Input File     : '01.mp3'
    Channels       : 1
    Sample Rate    : 44100
    Precision      : 16-bit
    Duration       : 00:10:48.80 = 28612212 samples = 48660.2 CDDA sectors
    File Size      : 5.19M
    Bit Rate       : 64.0k
    Sample Encoding: MPEG audio (layer I, II or III)
    ```
    - 文件是有元信息的，不是音频文件问题
- 还是发现，在 IOS safari 上，还是不能获得 audio.maxTime
- 问题预估：
    - 1.可能是文件太大了，IOS Safari 不支持太大的文件
    - 2.服务器的问题
- google 搜索： safari audio target.duration infinity
- 解决问题：
    - Safari 和 Chrome浏览器等其他浏览器不同
    - Safari 遇到audio时
        - Safari发出了两个请求：
        - 第一次请求会形如（Range: bytes=0-1)，只是尝试获取一些字节. 如果服务端没有根据这个请求返回相应的字节内容，那么safari就不会帮你解析下一个请求拿回来的全量音频数据，失去一系列audio标签的功能特性, 则Safari 会出现 audio target.duration = infinity
    - 在 服务端
        ```js
            var mp3 = path.resolve('./uploadFile/' + ctx.params.filename)

            ctx.set({
                'Content-Type': 'audio/mpeg',
                'Content-Length': fs.statSync(mp3).size,
            })
        
            if (ctx.headers.range === 'bytes=0-1') {
                ctx.set('Content-Range', `bytes 0-1/${fs.statSync(mp3).size}`) // 重点
                ctx.body = '1'
            } else {
                ctx.set({
                    'Accept-Ranges': 'bytes',
                })
                const src = fs.createReadStream(mp3)
                ctx.body = src
            }
        ```
    - 这样处理之后，Safari 就能读取到 audio duration 了
- 参考文章:
    - [H5音频处理——踩坑之旅 【CSDN】](https://blog.csdn.net/weixin_34192816/article/details/91434015)
    - [Safari audio file duration = infinity – how to fix? 【stackoverflow】](https://stackoverflow.com/questions/54946512/safari-audio-file-duration-infinity-how-to-fix)

## 问题2: 音频播放到时候 不能改变进度，不能快进
- 问题原因：
    - 用 stream 流到方式来传文件，这种方式是不能改变播放进度到，也不能快进
    - 改用 `fs.readFileSync(mp3)` 即可
    - 根据 请求范围 `ctx.headers.range`
    - 返回对应到文件部分: `ctx.body = fs.readFileSync(mp3).slice(start, end+1)`
- 解决办法
    ```js
    var mp3 = path.resolve('../uploadFile/' + ctx.params.filename)

    if (fs.existsSync(mp3)) {
        let size = fs.statSync(mp3).size

        ctx.set({
            'Content-Type': 'audio/mpeg;charset=UTF-8',
            'Accept-Ranges': 'bytes',
        })

        if (ctx.headers.range === 'bytes=0-1') {
            ctx.set('Content-Range', `bytes 0-1/${size}`)
            ctx.body = '1'
        } else if (ctx.headers.range) {

            // 可能遇到的5种情况：
            // 1.表示第二个500字节：bytes=500-999
            // 2.表示最后500个字节：bytes=-500
            // 3.表示500字节以后的范围：bytes=500-
            // 4.第一个和最后一个字节：bytes=0-0,-1
            // 5.同时指定几个范围：bytes=500-600,601-999

            let _range = ctx.request.header.range
            let [start, end] =  _range.replace('bytes=', '').split('-')
            start = parseInt(start, 10)
            end = parseInt(end, 10)

            if ( !isNaN(start) && isNaN(end) ) {
                start = start
                end = size - 1
            }
            if ( isNaN(start) && !isNaN(end) ) {
                start = size - end
                end = size - 1
            }

            // Handle unavailable range request
            if ( start >= size || end >= size ) {
                ctx.set({
                    'status': '416 Range Not Satisfiable',
                    'Content-Range': `bytes */${size}`
                })
            }

            ctx.response.status = 206
            ctx.set({
                'Content-Range': `bytes ${start}-${end}/${size}`,
                'Content-Length': (end - start) + 1,
            })

            // const src = fs.createReadStream(mp3, { start, end })
            // ctx.body = src
                // .on('open', () => {
                // 	ctx.body = src
                // })
                // .on('error', () => {
                // 	ctx.body = err
                // })

            ctx.body = fs.readFileSync(mp3).slice(start, end+1)
        }
    }
    ```
- 参考文章
    - [How to handle Partial Content in Node.js](https://medium.com/@phoenix.infotech1984/how-to-handle-partial-content-in-node-js-8b0a5aea216)
    - [【stackoverflow】使用Node.js将视频文件流式传输到html5视频播放器，以便视频控件继续起作用？](https://stackoverflow.com/questions/24976123/streaming-a-video-file-to-an-html5-video-player-with-node-js-so-that-the-video-c)
- [视频播放 - 腾讯云 Web 云点播服务的超级播放器](https://cloud.tencent.com/document/product/266/14424)