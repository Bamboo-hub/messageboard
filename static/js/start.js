var log = function() {
    console.log.apply(console, arguments)
}

var e = function(selector) {
    return document.querySelector(selector)
}

var es = function (sel) {
    return document.querySelectorAll(sel)
}

var buttonClick = function () {
    var button = e('#rect')
    button.addEventListener('click', function(event){
        log('点击')
    })
}

buttonClick()
