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
        // var keywords = "";
        // chrome.storage.local.get('yorkcms', function (result) {
        //     keywords = result.yorkcms;
        // console.log(result);
        // var para = document.createElement("p")
        // para.innerText = keywords
        // document.getElementById('app').appendChild(para)
        // });
        // console.log('已处理yorkbbs');
        // alert('aaa')
    }

});

/**
* Gets the HTML of the user's selection
*/
function getSelectionHTML() {
    var userSelection;
    if (window.getSelection) {
        // W3C Ranges
        userSelection = window.getSelection();
        // Get the range:
        if (userSelection.getRangeAt)
            var range = userSelection.getRangeAt(0);
        else {
            var range = document.createRange();
            range.setStart(userSelection.anchorNode, userSelection.anchorOffset);
            range.setEnd(userSelection.focusNode, userSelection.focusOffset);
        }
        // And the HTML:
        var clonedSelection = range.cloneContents();
        var div = document.createElement('div');
        div.appendChild(clonedSelection);
        return div.innerHTML;
    } else if (document.selection) {
        // Explorer selection, return the HTML
        userSelection = document.selection.createRange();
        return userSelection.htmlText;
    } else {
        return '';
    }
}
/**
* Listens for a request from the button in the browser.
* When it sees the getSelection request, it returns the selection HTML, as well as the URL and title of the tab.
*/
chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
    if (request.method == "getSelection") {
        var selection = window.getSelectionHTML();
        sendResponse({ body: selection, url: window.location.href, subject: document.title });
    }
    else
        sendResponse({}); // snub them.
});

