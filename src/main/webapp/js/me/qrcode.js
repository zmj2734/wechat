//mui.init({
//	swipeBack: true
//});
var auid = localStorage.getItem("auid");

var win = null;
var type = null;
var generalizeBaseUrl = booking.constants.ip + "/bz/join/index?user_id=",
	title = '你消费，我补贴!',
	content = null,
	thumbs = [booking.constants.ip + "/static/images/logo.png"],
	pictures = [booking.constants.ip + "/static/images/logo.png"];
$(function() {
	win = JSON.parse(localStorage.getItem("qrcode_attr"));
	var u_id = auid.split("_")[0];

	type = win.type;
	if(type == 1) {
		content = '加入到共生网，不影响正常消费，还能获得额外的消费补贴！点击我加入吧！';
	} else {
		content = '加入共生网，不影响正常消费，还能获得额外的消费补贴！共生网与商家和消费者共同打造全新消费格局，共享创业新平台！点击我加入吧！';
	}

	generalizeBaseUrl = generalizeBaseUrl + u_id;

	mui.app_request('POST', {
		'OPERATE_TYPE': '10054',
		'AUTH_ID': auid
	}, function(data) {
		console.log(JSON.stringify(data))
		if(data.RESULTCODE == '0') {
			var code_img = booking.constants.ip + data.qr_code_url;
			console.log(code_img)
			$(".my_img").attr("src", code_img);
		}
	}, function(result) {
		if(result.RESULTCODE == '-1') {
			mui.toast(result.DESCRIPTION);
		}
	});

	mui("#share_share").on("tap", '.wchat', function() {
		var id = this.getAttribute('data_id');
		var ex = this.getAttribute('data_ex');
		//初始化推广渠道信息
		initSysShareSerivces(function() {
			var weixin = 'weixin',
				sinaweibo = 'sinaweibo';
			if(id == weixin) {
				shareAction(id, generalizeBaseUrl, title, content, thumbs, pictures, ex);
			} else if(id == sinaweibo) {
				shareAction(id, generalizeBaseUrl, title, content, null, null, null);
			} else {
				shareAction(id, generalizeBaseUrl, title, content, thumbs, pictures, null);
			}
		});
	});

});