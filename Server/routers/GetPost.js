var url = require("url");
var queryString = require("querystring");

function onRequest(req,res){
    return new Promise((resolve, reject)=>{
        //过滤掉favicon请求
        if(req.url != "/favicon.ico"){
            //需要的json对象
            var obj = null;

            //区分get post 请求
            if(req.method == "GET"){
                obj = url.parse(req.url,true).query
                resolve(obj)
            }
            else{
                //post请求 获取表单数据
                var currentData = "";
                req.on("data",function(data){

                    // 为了兼容 下面两种提交方式

                    // 这里判断一下 data 是否是 JsonString
                    // Content-Type: application/json
                    if (isJsonString(data.toString())) { // 如果是对象
                        obj = JSON.parse(data.toString())  // buffer toString, 最后转成 obj
                        resolve(obj)
                        
                    } else {
                    // Content-Type: application/x-www-form-urlencoded
                        currentData += data;
                        obj = queryString.parse(currentData)  // 如果不是对象，就把 'foo=bar&abc=xyz&abc=123' 这种格式解析成对象
                        resolve(obj)
                    }
                });
            }
        }
    })
}

// 判断传入的是否是 对象 或者 JsonString
function isJsonString(str) {
    try {
        if (typeof str == 'object') return true
        if (typeof JSON.parse(str) == "object") return true
    } catch(e) {
    }
    return false
}

module.exports = onRequest
