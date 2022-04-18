console.log('这是content script!');
// alert('aaa')
// 注意，必须设置了run_at=document_start 此段代码才会生效
document.addEventListener('DOMContentLoaded', function () {
    // 给谷歌搜索结果的超链接增加 _target="blank"
    if (location.host == 'www.google.com.tw') {
        var objs = document.querySelectorAll('h3.r a');
        for (var i = 0; i < objs.length; i++) {
            objs[i].setAttribute('_target', 'blank');
        }
        console.log('已处理谷歌超链接！');
    }
    else if (location.host.indexOf('yorkbbs.ca/')) {
        // var objs = document.querySelectorAll('h3.r a');
        // for (var i = 0; i < objs.length; i++) {
        //     objs[i].setAttribute('_target', 'blank');
        // }
        var keywords = "";
        chrome.storage.local.get('yorkcms', function (result) {
            keywords = result.yorkcms;
            console.log(result);
            var para = document.createElement("p")
            para.innerText = keywords
            document.getElementById('app').appendChild(para)
        });
        console.log('已处理yorkbbs');
        // alert('aaa')
    }

});