const message = require('../model/message')


var sendHtml = function(path, response) {
    var fs = require('fs')
    var options = {
        encoding: 'utf-8'
    }
    path = 'template/' + path
    fs.readFile(path, options, function(err, data){
        // console.log(`读取的html文件 ${path} 内容是`, data)
        // 替换参数
        response.send(data)
    })
}

var index = {
    path: '/',
    method: 'get',
    func: function(request, response) {
        var path = 'start_index.html'
        sendHtml(path, response)
    }
}


var messageboard = {
    path: '/messageboard',
    method: 'get',
    func: function(request, response) {
        var path = 'message_index.html'
        sendHtml(path, response)
    }
}

var routes = [
    index,
    messageboard,
]

module.exports.routes = routes
