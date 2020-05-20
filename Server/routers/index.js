const Router = require('koa-router')
const router = new Router()
const fs = require('fs')
const path = require('path')
const query = require('../db/query')
let onRequest = require('./GetPost.js')


// 首页
router.get('/', async(ctx, next) => {
	let indexData = ''
	await new Promise((resolve, reject)=>{
		fs.readFile(__dirname + '../../static/index.html', (err, data)=>{
			if(err) throw err
			indexData = data + ''
			resolve()
		})
	})
	ctx.body = indexData
})

router.get('/uploadFile/:filename', async(ctx, next) => {
	var mp3 = path.resolve('/www/wwwroot/threeki/dedao/server-no-pm2/uploadFile/' + ctx.params.filename)
	// var mp3 = path.resolve(__dirname + '../../../../uploadFile/' + ctx.params.filename)

	if (fs.existsSync(mp3)) {
		// ctx.set({
		// 	'Content-Type': 'audio/mpeg',
		// 	'Content-Length': fs.statSync(mp3).size,

		// 	// 'Accept-Ranges': 'bytes',
		// 	'Access-Control-Allow-Credentials': true,
		// 	'Access-Control-Allow-Headers': 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range',
		// 	'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',

		// 	'Pragma': 'public',
		// 	'Expires': '0',
		// 	'Content-Disposition': 'inline; filename="' + mp3 + '"',
		// 	'Content-Range': 'bytes 0-10240' + '/' + fs.statSync(mp3).size, 
		// 	'Accept-Ranges': 'bytes',
		// 	'X-Pad': 'avoid browser bug',
		// 	'Cache-Control': 'no-cache',
		// 	'Etag': '' + fs.statSync(mp3).size,
		// })


		let size = fs.statSync(mp3).size

		ctx.set({
			'Content-Type': 'audio/mpeg;charset=UTF-8',
			'Accept-Ranges': 'bytes',
		})
	
		if (ctx.headers.range === 'bytes=0-1') {
			console.log('in 1 !!!')
			ctx.set('Content-Range', `bytes 0-1/${size}`)
			ctx.body = '1'
		} else if (ctx.headers.range) {
			console.log('in 2 !!!')

			// 可能遇到的5种情况：
			// 1.表示第二个500字节：bytes=500-999
			// 2.表示最后500个字节：bytes=-500
			// 3.表示500字节以后的范围：bytes=500-
			// 4.第一个和最后一个字节：bytes=0-0,-1
			// 5.同时指定几个范围：bytes=500-600,601-999

			let _range = ctx.request.header.range
			// _range = 'bytes=5000000-' //
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
			console.log(start, end)

			// Handle unavailable range request
			if ( start >= size || end >= size ) {
				ctx.set({
					'status': '416 Range Not Satisfiable',
					'Content-Range': `bytes */${size}`
				})
			}

			ctx.response.status = 206
			ctx.set({
				// 'status': '206 Partial Content',
				'Content-Range': `bytes ${start}-${end}/${size}`,
				'Content-Length': (end - start) + 1,

				// 'Access-Control-Allow-Credentials': true,
				// 'Access-Control-Allow-Headers': 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range',
				// 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
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
			
		} else {
			console.log('in 3 !!!')
			ctx.set({
				'Accept-Ranges': 'bytes',
				// 'Access-Control-Allow-Credentials': true,
				// 'Access-Control-Allow-Headers': 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range',
				// 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
			})
			console.log('文件存在')
			const src = fs.createReadStream(mp3)
			ctx.body = src
		}

	} else {
		ctx.body = 'error: 你所访问的文件并不存在, 路径：' + mp3
	}
})


// 获取所有数据
router.get('/api/data/retrieve/playList', async(ctx, next) => {
	let rows = await query("select * from playlist")

	// console.log(rows)
	
    ctx.body = {
        code: 1,
        msg: '请求成功',
        data: rows
    }
})


// 创建（Create）、更新（Update）、读取（Retrieve）和删除（Delete）

// Create 添加/创建
router.post('/api/data/create', async(ctx, next) => {
	// 获取提交的数据
	let data = await onRequest(ctx.req).then((data)=> data )

	let name   = data.name
	let number = data.number
	let date   = data.date

	// 判断参数是否为空
	if ((name == undefined || name == '') || (number == undefined || number == '') || (date == undefined || date == '')) {
		ctx.body = {
	        code: 0,
	        msg: '请求失败',
	        data: '数据不合法，参数不全，undefined'
	    }
	    return
	} else { // 如果参数是非空
		let sql = `INSERT INTO chip (name, number, date) VALUES ("${name}", "${number}", "${date}")`

		let rows = await query(sql)
	    ctx.body = {
	        code: 1,
	        msg: '创建成功',
	        data: rows
	    }
	}
})


// retrieve 读取/查询
router.post('/api/data/retrieve', async(ctx, next) => {
	let data = await onRequest(ctx.req).then((data)=> data )
	ctx.body = '你查询的是'+ ctx.params.number
	let rows = await query("select * from chip WHERE number='" + data.search_number +"'")
	if (typeof rows == Object || rows.length == 0) {
	    ctx.body = {
	        code: 0,
	        msg: '请求成功，但该数据不存在',
	        data: rows
	    }
	} else {
	    ctx.body = {
	        code: 1,
	        msg: '请求成功',
	        data: rows
	    }
	}
})

// 获取所有数据
router.get('/api/data/retrieve/all', async(ctx, next) => {
	let rows = await query("select * from chip")
    ctx.body = {
        code: 1,
        msg: '请求成功',
        data: rows
    }
})



// Update 更新/修改
router.post('/api/data/update', async(ctx, next) => {
	let data = await onRequest(ctx.req).then((data)=> data )
	let rows = await query(`UPDATE chip SET name='${data.name}', number='${data.number}', date='${data.date}' WHERE id=${data.id}`)
    ctx.body = {
        code: 1,
        msg: '修改成功',
        data: rows
    }
})


// delete 删除
router.post('/api/data/delete', async(ctx, next) => {
	let data = await onRequest(ctx.req).then((data)=> data )
	let rows = await query(`DELETE FROM chip WHERE id=${data.id}`)
    ctx.body = {
        code: 1,
        msg: '删除成功',
        data: rows
    }
})


/*
	Koa从零搭建之文件上传
	链接：https://juejin.im/post/5d81d443e51d45620d2cb98d
	来源：掘金
*/
// router.post('/upload', async (ctx, next) => {
// 	// console.log('xxx => ', ctx.request.files);
// 	// console.log('xxx => ', ctx.request.files[''].path);


// 	/* 以下是文件重命名 - start
// 		命名格式如下
// 		资产与负债解析.fc1ddd0b8601328a951bdf245ef1d3e1.mp4
// 	*/
// 	// 获取上传文件名
// 	let name = ctx.request.files[''].name	// 上传文件名 + extname
// 	name = name.replace(path.extname(name), '')	// 上传文件名
	
// 	// 获取文件存放绝对路径
// 	const filesPath = ctx.request.files[''].path //  /www/wwwroot/threeki/longyu/static/upload/upload_622540a2766a0c24bda6157c0f225c1c.mp4
// 	const arr = filesPath.split('/')
// 	arr.pop() // pop方法会删除args最后一个元素,并返回
// 	const absolutePath = arr.join('/') + '/'	// /www/wwwroot/threeki/longyu/static/upload

// 	const oldName = filesPath.split('/').pop() // 取得服务器命名的名字， pop方法会删除args最后一个元素,并返回
// 	const fileName = name + '.' + oldName.replace('upload_', '')	// 拼接了hash 的名字
// 	fs.renameSync(absolutePath + oldName, absolutePath + fileName)
// 	/* 文件重命名 - end */



// 	ctx.body = JSON.stringify(ctx.request.files);


// 	// const reader = fs.createReadStream(file.path);	// 创建可读流
// 	// const ext = file.name.split('.').pop();		// 获取上传文件扩展名
// 	// const upStream = fs.createWriteStream(`upload/${Math.random().toString()}.${ext}`);		// 创建可写流
// 	// reader.pipe(upStream);	// 可读流通过管道写入可写流
// 	// return ctx.body = '上传成功';
// })

module.exports = router
