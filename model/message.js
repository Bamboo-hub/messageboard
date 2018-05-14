var fs = require('fs')


var messageFilePath = 'db/message.json'
var messageBackups = 'db/message_backups.json'


// 这是一个用来存储 Message 数据的对象
const ModelMessage = function(form) {
    this.content = form.content || ''
    this.created_time = Math.floor(new Date() / 1000)
}

const loadMessages = function() {
    var content = fs.readFileSync(messageFilePath, 'utf8')
    var messages = JSON.parse(content)
    return messages
}

const backupsMessages = function() {
    var content = fs.readFileSync(messageBackups, 'utf8')
    var messages = JSON.parse(content)
    return messages
}

/*
m 这个对象是我们要导出给别的代码用的对象
它有一个 data 属性用来存储所有的 messages 对象
它有 all 方法返回一个包含所有 message 的数组
它有 new 方法来在数据中插入一个新的 message 并且返回
他有 save 方法来保存更改到文件中
*/
var m = {
    data: loadMessages()
}

var bm = {
    data: backupsMessages()
}

m.get = function(id) {
    const comment = require('./comment')
    var comments = comment.all()
    //
    var messages = this.data
    for(var i = 0; i < messages.length; i++){
        var message = messages[i]
        if(message.id == id) {
            var cs = []
            for (var j = 0; j < comments.length; j++) {
                var c = comments[j]
                if (message.id == c.message_id) {
                    cs.push(c)
                }
            }
            message.comments = cs
            return message
        }
    }
    // 循环结束都没有找到, 说明出错了, 那就返回一个空对象好了
    return {}
}

m.all = function() {
    var messages = this.data
    for (var i = 0; i < messages.length; i++) {
        var message = messages[i]
    }
    return messages
}

m.new = function(form) {
    var m = new ModelMessage(form)
    // console.log('new message', form, m)
    // 设置新数据的 id
    var d = this.data[this.data.length-1]
    if (d == undefined) {
        m.id = 1
    } else {
        m.id = Math.floor(new Date() / 100)
    }
    // 把 数据 加入 this.data 数组
    this.data.push(m)
    // 把 最新数据 保存到文件中
    this.save()
    console.log(bm, 'bm')
    bm.data.push(m)
    bm.saveBackups()
    // 返回新建的数据
    return m
}

/*
它能够删除指定 id 的数据
删除后保存修改到文件中
*/
m.delete = function(id) {
    var messages = this.data
    var found = false
    for (var i = 0; i < messages.length; i++) {
        var message = messages[i]
        if (message.id == id) {
            found = true
            break
        }
    }
    // 用 splice 函数删除数组中的一个元素
    // 如果没找到, i 的值就是无用值, 删除也不会报错
    // 所以不用判断也可以
    messages.splice(i, 1)
    // 把 最新数据 保存到文件中
    this.save()
    return found
}

m.save = function() {
    var s = JSON.stringify(this.data, null, 2)
    fs.writeFile(messageFilePath, s, (err) => {
        if (err) {
            console.log(err)
        } else {
            console.log('保存成功')
        }
    })
}


bm.saveBackups = function() {
    var m = JSON.stringify(this.data, null, 2)
    console.log('m', m)
    fs.writeFile(messageBackups, m, (err) => {
        if (err) {
            console.log(err)
        } else {
            console.log('备份保存成功')
        }
    })
}
module.exports = m
