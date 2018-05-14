// ../ 表示上一级目录
const message = require('../model/message')


var all = {
    path: '/api/message/all',
    method: 'get',
    func: function(request, response) {
        var messages = message.all()
        var r = JSON.stringify(messages, null, 2)
        response.send(r)
    }
}

var add = {
    path: '/api/message/add',
    method: 'post',
    func: function(request, response) {
        // 浏览器发过来的数据我们一般称之为 form (表单)
        var form = request.body
        // 插入新数据并返回
        var m = message.new(form)
        var r = JSON.stringify(m)
        response.send(r)
    }
}

var verifypassword = {
    path: '/api/message/verifypassword',
    method: 'post',
    func: function(request, response) {
        // 浏览器发过来的数据我们一般称之为 form (表单)
        var form = request.body
        var m = message.verifypassword(form)
        var r = JSON.stringify(m)
        response.send(r)
    }
}

/*
请求 POST /api/message/delete 来删除一个博客
ajax 传的参数是下面这个对象的 JSON 字符串
{
    id: 1
}
*/

// 用 deleteMessage 而不是 delete 是因为 delete 是一个 js 关键字(就像是 function 一样)
var deleteMessage = {
    path: '/api/message/delete',
    method: 'post',
    func: function(request, response) {
        // 浏览器发过来的数据我们一般称之为 form (表单)
        var form = request.body
        // 删除数据并返回结果
        var success = message.delete(form.id)
        var result = {
            success: success,
        }
        var r = JSON.stringify(result)
        response.send(r)
    }
}

var routes = [
    all,
    add,
    verifypassword,
    deleteMessage,
]

// for(var i = 0; i < n; i++)
// for(var i in computers)
// for(var i of computers)

module.exports.routes = routes
