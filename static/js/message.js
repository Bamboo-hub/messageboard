var log = function() {
    console.log.apply(console, arguments)
}

var e = function(selector) {
    return document.querySelector(selector)
}

var es = function (sel) {
    return document.querySelectorAll(sel)
}

var ajax = function(request) {
    var r = new XMLHttpRequest()
    r.open(request.method, request.url, true)
    if (request.contentType !== undefined) {
        r.setRequestHeader('Content-Type', request.contentType)
    }
    r.onreadystatechange = function(event) {
        if(r.readyState === 4) {
            request.callback(r.response)
        }
    }
    if (request.method === 'GET') {
        r.send()
    } else {
        r.send(request.data)
    }
}

// 给多个class绑定事件
var bindAll = function (elements, eventName, callback) {
    for (var i = 0; i < elements.length; i++) {
        var tag = elements[i]
        tag.addEventListener(eventName, callback)
    }
}

var controlCSS = function(messages) {
    // 默认显示页一留言
    var messageOne = e('#messages-1')
    if (messageOne != null) {
        messageOne.classList.add('show')
    }
    // 默认页码一加上外发光效果
    var messageOne = e('#page-1')
    if (messageOne != null) {
        messageOne.classList.add('active')
    }
    // 根据页数的多少决定页码模块宽度
    if (messages.length != 0) {
        var pages = Math.ceil(messages.length / 5)
        var width = pages * 30
        var pagebox = e('#pagebox')
        pagebox.style.width = `${width}px`
    }
}

var newpage = function(messages) {
    if (messages.length != 0) {
        var pages = Math.ceil(messages.length / 5)
        for (var i = 1; i <= pages; i++) {
            var m = `<div class="page" id="messages-${i}">
        </div>`
            var messageContainer = e('#messages')
            messageContainer.insertAdjacentHTML('beforeend', m)

            var p = `<div class="pageint" id="page-${i}" data-index="${i}">${i}</div>`
            var messageContainer = e('#pagebox')
            // 第一个参数 'beforeend' 意思是放在最后
            messageContainer.insertAdjacentHTML('beforeend', p)
        }
    }
}

var findALL = function(element, selector) {
    return element.querySelectorAll(selector)
}

var findContainer = function() {
    var pagemax = es('.page').length
    for (var i = 1; i <= pagemax; i++) {
        var c = '#messages-'
        var container = e(c + i)
        var cl = findALL(container, '*').length
        if (cl < 20) {
            return container
        } else if (cl >= 20) {
            continue
        }
    }
}

var insertMessageAll = function(messages) {
    for (var i = 0; i < messages.length; i++) {
        var m = messages[i]
        var t = templateMessage(m)
        var messageContainer = findContainer()
        // 这个方法用来添加元素
        // 第一个参数 'beforeend' 意思是放在最后
        messageContainer.innerHTML += t
    }
}


// 创建一个 messages 数组用来保存所有的 message
var messages = []

// 载入页面的时候  把已经有的 message 加载到页面中
var loadMessages = function() {
    var request = {
        method: 'GET',
        url: '/api/message/all',
        contentType: 'application/json',
        callback: function(response) {
            // 不考虑错误情况(断网/服务器返回错误等等)
            var messages = JSON.parse(response)
            window.messages = messages
            newpage(messages)
            controlCSS(messages)
            bindEventSwitch()
            insertMessageAll(messages)
        }
    }
    ajax(request)
}

var messageNew = function(form) {
    // var form = {
    //     content: "测试标题",
    // }
    var data = JSON.stringify(form)
    var request = {
        method: 'POST',
        url: '/api/message/add',
        data: data,
        contentType: 'application/json',
        callback: function(response) {
            console.log('有新的留言', response)
            var res = JSON.parse(response)
        }
    }
    ajax(request)
}

// 添加新的留言
var buttonClick = function() {
    var button = e('#button')
    var input = e('#input')
    button.addEventListener('click', function(event){
        var content = input.value
        if (content.length >= 1) {
            // 得到用户填写的数据
            var form = {
                content: content,
            }
            // 用这个数据调用 messageNew 来创建一篇新博客
            messageNew(form)
            swal("发送成功！", "HTTP://sdykpym.cn","success")
        }
    })
}

var templateMessage = function(message) {
    var id = message.id
    var content = message.content
    var m = `
    <div class="message-cell" data-id="${id}">
        <div class="message-bg">
            <div class='message-content' >${content}</div>
        </div>
        <img class='message-delete' src=images/message_delete.png>
    </div>
    `
    return m
}

var bindEventSwitch = function() {
    // 切换留言与页码 css
    var selector = es('.pageint')
    bindAll(selector, 'click', function(event){
        var button = event.target
        var xwbc = button.dataset.index
        // 切换页码相应 class
        var a = e('.active')
        a.classList.remove('active')
        var img = '#page-' + String(xwbc)
        var img1 = e(img)
        img1.classList.add('active')

        // 切换相应页数的留言
        var s = e('.show')
        s.classList.remove('show')
        var page = '#messages-' + String(xwbc)
        var page1 = e(page)
        page1.classList.add('show')
    })
}

var bindEventPassword = function() {
    // 绑定删除功能
    document.body.addEventListener('click', function (event) {
        var self = event.target
        if(self.classList.contains('message-delete')){
            swal({
                title: "这个是管理员使用的删除功能",
                text: "乖孩子不要乱试密码",
                content: {
                    element: "input",
                    attributes: {
                        placeholder: "Type your password",
                        type: "password",
                    },
                },
            })
            .then((value) => {
                verifyPassword(value, self)
            })
        }
    })
}

var verifyPassword = function(string, element) {
    var form = {
        password: string,
        state: false,
    }
    var data = JSON.stringify(form)
    var request = {
        method: 'POST',
        url: '/api/message/verifypassword',
        data: data,
        contentType: 'application/json',
        callback: function(response) {
            var res = JSON.parse(response)
            if(res.state === true) {
                deleteMessage(element)
            }
        }
    }
    ajax(request)

}

var deleteMessage = function(element) {
    var cell = element.parentElement
    var index = cell.dataset.id
    // 得到用户填写的数据
    var form = {
        id: index,
    }
    var data = JSON.stringify(form)
    var request = {
        method: 'POST',
        url: '/api/message/delete',
        data: data,
        contentType: 'application/json',
        callback: function(response) {
            var c = JSON.parse(response)
        }
    }
    ajax(request)
    // 删除 message-cell
    cell.remove()
}

findContainer()

loadMessages()

buttonClick()
bindEventPassword()
