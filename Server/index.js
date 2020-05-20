const koa = require('koa')
const app = new koa()
const router = require('./routers')
const path = require('path')
const static = require('koa-static')
// const koaBody = require('koa-body')

app.use(async (ctx, next) => {
    ctx.set("Access-Control-Allow-Origin", "*");   // 跨域，允许来自所有域名请求
    await next();
})

// 静态资源服务器
const staticPath = './static'
app.use(static(
  path.join(__dirname, staticPath)
))

// Koa2 之文件上传下载 
// 用 koa-body 中间件来处理文件上传
// 链接：https://juejin.im/post/5d81d443e51d45620d2cb98d
// app.use(koaBody({
//   multipart:true, // 支持文件上传
//   encoding:'gzip',
//   formidable:{
//     uploadDir:path.join(__dirname,'./static/upload/'), // 设置文件上传目录
//     keepExtensions: true,    // 保持文件的后缀
//     maxFieldsSize:5 * 1024 * 1024, // 文件上传大小, default 2mb (2 * 1024 * 1024)
//     onFileBegin:(name,file) => { // 文件上传前的设置
//       // console.log(`name: ${name}`);
//       // console.log(file);
//     },
//   }
// }));
// 安装使用 koa-body 后导致 post 提交数据请求时 415 unsupported media type

app
    .use(router.routes())
    .use(router.allowedMethods())   // 允许基本方法

app.listen(3308, ()=>{ console.log('server is runing at 3308 port') })
