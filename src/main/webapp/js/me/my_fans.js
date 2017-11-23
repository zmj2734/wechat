mui.init({

	gestureConfig: {
		doubletap: true
	},
	subpages: [{
		url: 'my_fans_sub.html',
		id: 'my_fans_sub.html',
		styles: {
			top: '45px',
			bottom: '0px',
		}
	}]
});
var contentWebview = null;
$(function() {
	
	document.querySelector('header').addEventListener('doubletap', function() {
		if(contentWebview == null) {
			contentWebview = plus.webview.currentWebview().children()[0];
		}
		contentWebview.evalJS("mui('#pullrefresh').pullRefresh().scrollTo(0,0,100)");
	});

	document.getElementById("detail").addEventListener("tap", function() {
		mui.openWindow({
			url: "my_fans_exp.html",
			id: "my_fans_exp",
		})
	})
})