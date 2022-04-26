// console.log('这是background.js');
// chrome.runtime.onInstalled.addListener(function () {
// 	chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
// 		chrome.declarativeContent.onPageChanged.addRules([
// 			{
// 				conditions: [
// 					// 只有打开百度才显示pageAction
// 					new chrome.declarativeContent.PageStateMatcher({ pageUrl: { urlContains: 'baidu.com' } })
// 				],
// 				actions: [new chrome.declarativeContent.ShowPageAction()]
// 			}
// 		]);
// 	});
// });
chrome.contextMenus.create({
	title: "采集当前页新闻",
	onclick: function () {
		// alert('您点击了右键菜单！')
		chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
			let url = tabs[0].url
			// console.log(url)
			chrome.tabs.create({ url: 'https://cms.yorkbbs.ca/publish/post?&url=' + encodeURI(url) });
		})
	}
})

// 获取当前选项卡ID
function getCurrentTabId(callback) {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		if (callback) callback(tabs.length ? tabs[0].id : null);
	});
}

function copyTextToClipboard(text) {
	var copyFrom = $('<textarea/>');
	copyFrom.text(text);
	$('body').append(copyFrom);
	copyFrom.select();
	document.execCommand('copy');
	copyFrom.remove();
}

chrome.contextMenus.create({
	title: '保存选中内容', // %s表示选中的文字
	contexts: ['selection'], // 只有当选中文字时才会出现此右键菜单
	onclick: function (params) {
		// alert(params)
		console.log('保存选中内容 click')
		// console.log('selection', params)
		// Save data to storage locally, in just this browser...
		// chrome.storage.local.set({ "yorkcms": params.selectionText }, function () {
		// 	//  Data's been saved boys and girls, go on home
		// 	console.log('save success')
		// })
		// 注意不能使用location.href，因为location是属于background的window对象
		// chrome.tabs.create({ url: 'https://cms.yorkbbs.ca/publish/post?&url=' + encodeURI(tab.url) });
		// chrome.tabs.create({ url: 'https://cms.yorkbbs.ca/publish/post?&from=storage' })
		getCurrentTabId((tabId) => {
			// var successful = document.execCommand('copy');
			// var msg = successful ? 'successful' : 'unsuccessful';
			// console.log('Copy email command was ' + msg);
			// chrome.tabs.create({ url: 'https://cms.yorkbbs.ca/publish/post?clipboard=1' })

			chrome.tabs.sendRequest(tabId, { method: "getSelection" }, function (response) {
				// console.log('2222')
				var url = response.url
				var subject = response.subject
				var body = response.body
				console.log(url, subject, body)
				if (body == '') {
					body = "No text selected";
					//You may choose to pop up a text box allowing the user to enter in a message instead.
				}

				//From here, you can POST the variables to any web service you choose.
				// chrome.cookies.set({ url: "http://yorktest.xyz/", name: "collectNews", value: body, expirationDate: new Date().getTime() + 3600 });
				// alert(url)
				// alert(subject)
				// alert(body)
				// document.execCommand("Copy")
				var copyJson = { title: subject, url: url, html: body }
				var text = JSON.stringify(copyJson)
				if (url.indexOf('51.ca') >= 0) {
					text = replaceAll(text, '/uploads/Image/', 'https://info.51.ca/uploads/Image/')
				}
				copyTextToClipboard(text)
				chrome.tabs.create({ url: 'https://cms.yorkbbs.ca/publish/post?clipboard=1' })
				// chrome.tabs.create({ url: 'http://localhost:8080/publish/post?clipboard=1' })
				// console.log('4444');
				// document.execCommand("paste")
				// setTimeout(function () { console.log('33333'); document.execCommand("paste"); }, 5000)
			})
		})
	}
})

/**
 * 替换所有
 * @param str
 * @param find
 * @param replace
 */
function replaceAll(str, find, replace) {
	return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace)
}

chrome.browserAction.onClicked.addListener(function (tab) {
	chrome.tabs.sendRequest(tab.id, { method: "getSelection" }, function (response) {

		var url = response.url;
		var subject = response.subject;
		var body = response.body;
		console.log(url, subject, body)
		if (body == '') {
			body = "No text selected";
			//You may choose to pop up a text box allowing the user to enter in a message instead.
		}

		//From here, you can POST the variables to any web service you choose.

		alert(body)


	});
});