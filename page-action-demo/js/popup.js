$(function () {

	// // 加载设置
	// var defaultConfig = { color: 'white' }; // 默认配置
	// chrome.storage.sync.get(defaultConfig, function (items) {
	// 	document.body.style.backgroundColor = items.color;
	// });

	// 初始化国际化
	// $('#test_i18n').html(chrome.i18n.getMessage("helloWorld"));
})

// chrome.runtime.onMessage.addListener(function (request, sender) {
// 	if (request.action == "getSource") {
// 		message.innerText = request.source;
// 	}
// });

// function onWindowLoad() {

// 	var message = document.querySelector('#message');

// 	chrome.tabs.executeScript(null, {
// 		file: "getPagesSource.js"
// 	}, function () {
// 		// If you try and inject into an extensions page or the webstore/NTP you'll get an error
// 		if (chrome.runtime.lastError) {
// 			message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
// 		}
// 	});

// }

// window.onload = onWindowLoad;

$('#open_main_page').click(() => {
	chrome.tabs.create({ url: 'https://yorkbbs.ca' });
})

$('#open_forum').click(() => {
	chrome.tabs.create({ url: 'https://forum.yorkbbs.ca' });
})

$('#open_cms').click(() => {
	chrome.tabs.create({ url: 'https://cms.yorkbbs.ca' });
})

$('#open_sa').click(() => {
	chrome.tabs.create({ url: 'https://sa.yorkbbs.ca' });
})


// 打开后台页
$('#open_background').click(e => {
	window.open(chrome.extension.getURL('background.html'));
});

// 调用后台JS
$('#invoke_background_js').click(e => {
	var bg = chrome.extension.getBackgroundPage();
	bg.testBackground();
});

// 获取后台页标题
$('#get_background_title').click(e => {
	var bg = chrome.extension.getBackgroundPage();
	alert(bg.document.title);
});

// 设置后台页标题
$('#set_background_title').click(e => {
	var title = prompt('请输入background的新标题：', '这是新标题');
	var bg = chrome.extension.getBackgroundPage();
	bg.document.title = title;
	alert('修改成功！');
});

// 自定义窗体大小
$('#custom_window_size').click(() => {
	chrome.windows.getCurrent({}, (currentWindow) => {
		var startLeft = 10;
		chrome.windows.update(currentWindow.id,
			{
				left: startLeft * 10,
				top: 100,
				width: 800,
				height: 600
			});
		var inteval = setInterval(() => {
			if (startLeft >= 40) clearInterval(inteval);
			chrome.windows.update(currentWindow.id, { left: (++startLeft) * 10 });
		}, 50);
	});
});

// 最大化窗口
$('#max_current_window').click(() => {
	chrome.windows.getCurrent({}, (currentWindow) => {
		// state: 可选 'minimized', 'maximized' and 'fullscreen' 
		chrome.windows.update(currentWindow.id, { state: 'maximized' });
	});
});


// 最小化窗口
$('#min_current_window').click(() => {
	chrome.windows.getCurrent({}, (currentWindow) => {
		// state: 可选 'minimized', 'maximized' and 'fullscreen' 
		chrome.windows.update(currentWindow.id, { state: 'minimized' });
	});
});

// 打开新窗口
$('#open_new_window').click(() => {
	chrome.windows.create({ state: 'maximized' });
});

// 关闭全部
$('#close_current_window').click(() => {
	chrome.windows.getCurrent({}, (currentWindow) => {
		chrome.windows.remove(currentWindow.id);
	});
});

// 新标签打开网页
$('#open_url_new_tab').click(() => {
	chrome.tabs.create({ url: 'https://www.baidu.com' });
});

// 当前标签打开网页
$('#open_url_current_tab').click(() => {
	getCurrentTabId(tabId => {
		chrome.tabs.update(tabId, { url: 'http://www.so.com' });
	});
});

// 获取当前标签ID
$('#get_current_tab_id').click(() => {
	getCurrentTabId(tabId => {
		alert('当前标签ID：' + tabId);
	});
});

// 高亮tab
$('#highlight_tab').click(() => {
	chrome.tabs.highlight({ tabs: 0 });
});

// popup主动发消息给content-script
$('#send_message_to_content_script').click(() => {
	sendMessageToContentScript('你好，我是popup！', (response) => {
		if (response) alert('收到来自content-script的回复：' + response);
	});
});

// 监听来自content-script的消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	console.log('收到来自content-script的消息：');
	console.log(request, sender, sendResponse);
	sendResponse('我是popup，我已收到你的消息：' + JSON.stringify(request));
});

// popup与content-script建立长连接
$('#connect_to_content_script').click(() => {
	getCurrentTabId((tabId) => {
		var port = chrome.tabs.connect(tabId, { name: 'test-connect' });
		port.postMessage({ question: '你是谁啊？' });
		port.onMessage.addListener(function (msg) {
			alert('收到长连接消息：' + msg.answer);
			if (msg.answer && msg.answer.startsWith('我是')) {
				port.postMessage({ question: '哦，原来是你啊！' });
			}
		});
	});
});

// 获取当前选项卡ID
function getCurrentTabId(callback) {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		if (callback) callback(tabs.length ? tabs[0].id : null);
	});
}

// 这2个获取当前选项卡id的方法大部分时候效果都一致，只有少部分时候会不一样
function getCurrentTabId2() {
	chrome.windows.getCurrent(function (currentWindow) {
		chrome.tabs.query({ active: true, windowId: currentWindow.id }, function (tabs) {
			if (callback) callback(tabs.length ? tabs[0].id : null);
		});
	});
}

// 向content-script主动发送消息
function sendMessageToContentScript(message, callback) {
	getCurrentTabId((tabId) => {
		chrome.tabs.sendMessage(tabId, message, function (response) {
			if (callback) callback(response);
		});
	});
}

// 向content-script注入JS片段
function executeScriptToCurrentTab(code) {
	getCurrentTabId((tabId) => {
		chrome.tabs.executeScript(tabId, { code: code });
	});
}


// 演示2种方式操作DOM

// 修改背景色
$('#update_bg_color').click(() => {
	console.log('aaa')
	executeScriptToCurrentTab('document.body.style.backgroundColor="red";')
});

// // 获取选择html
// $('#btnGetHtml').click(() => {
// 	console.log('btnGetHtml')
// 	chrome.browserAction.onClicked.addListener(function (tab) {
// 		chrome.tabs.sendRequest(tab.id, { method: "getSelection" }, function (response) {

// 			var url = response.url;
// 			var subject = response.subject;
// 			var body = response.body;
// 			console.log(url, subject, body)
// 			if (body == '') {
// 				body = "No text selected";
// 				//You may choose to pop up a text box allowing the user to enter in a message instead.
// 			}

// 			//From here, you can POST the variables to any web service you choose.

// 			alert(body)


// 		});
// 	});
// });

// 修改字体大小
$('#update_font_size').click(() => {
	sendMessageToContentScript({ cmd: 'update_font_size', size: 42 }, function (response) { });
});

// 显示badge
$('#show_badge').click(() => {
	chrome.browserAction.setBadgeText({ text: 'New' });
	chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
});

// 隐藏badge
$('#hide_badge').click(() => {
	chrome.browserAction.setBadgeText({ text: '' });
	chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 0, 0] });
});

$('#test').click(() => {
	console.log("Popup DOM fully loaded and parsed");

	function modifyDOM() {
		//You can play with your DOM here or check URL against your regex
		console.log('Tab script:');
		console.log(document.head.title);
		console.log(document.body);
		return document.body.innerHTML;
	}

	//We have permission to access the activeTab, so we can call chrome.tabs.executeScript:
	chrome.tabs.executeScript({
		code: '(' + modifyDOM + ')();' //argument here is a string but function.toString() returns function's code
	}, (results) => {
		//Here we have just the innerHTML and not DOM structure
		console.log('Popup script:')
		console.log(results[0]);
	});
});