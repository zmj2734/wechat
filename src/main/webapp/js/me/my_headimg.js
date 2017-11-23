mui.init({
	swipeBack: true
});
var win = "";
var head_url = "";
var auid = localStorage.getItem("auid");
$(function() {
	
	win = JSON.parse(localStorage.getItem("my_headimg_attr"));
	head_url = win.head_imgurl;
	console.log(head_url);
	if(!mui.isnull(head_url)) {
		document.getElementById('big_img').src = booking.constants.ip + head_url;
	}

	document.getElementById("back").addEventListener("tap", function() {
		booking.closeAndOpenNewWindow(win.backId + ".html", win.backId);
	})

	document.getElementById('big_img').addEventListener('tap', function() {
		if(mui.os.plus) {
			var a = [{
				title: "拍照"
			}, {
				title: "从手机相册选择"
			}];
			plus.nativeUI.actionSheet({
				title: "上传图片",
				cancel: "取消",
				buttons: a
			}, function(b) { /*actionSheet 按钮点击事件*/
				switch(b.index) {
					case 0:
						break;
					case 1:
						getImage(1000, 800, "big_img", "sphotos", uploadSucess) /*拍照*/
						break;
					case 2:
						galleryImg(1000, 800, "big_img", "sphotos", uploadSucess); /*打开相册*/
						break;
					default:
						break;
						getIm
				}
			})
		}
	}, false);

	function uploadSucess(data, id) {

		head_img = booking.constants.ip + data.RESULTLIST.PATH;
		document.getElementById(id).src = head_img;
		mui.app_request('POST', {
			"OPERATE_TYPE": "10009",
			"AUTH_ID": auid,
			"HEADER_IMG": data.RESULTLIST.PATH
		}, function(data) {
			if(data.RESULTCODE == "0") {
				booking.closeAndOpenNewWindow(win.backId + ".html", win.backId);

			}
		}, function(result) {
			mui.toast(result.DESCRIPTION);
		});
	}
});