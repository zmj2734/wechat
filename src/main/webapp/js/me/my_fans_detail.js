mui.init({
	swipeBack: true,
	pullRefresh: {
		container: "#pullrefresh", //待刷新区域标识
		up: {
			contentrefresh: "正在加载...",
			callback: listmore
		},
	}
});
var list_num = 0;
var auid = null;
var size = 10;
var win = null;
var state = null;
var userid = null;
var money = null;
$(function() {
	
	win = JSON.parse(localStorage.getItem("my_fans_detail_attr"));
	state = win.state;
	userid = win.userid;
	money = win.money;

	var u = navigator.userAgent;
	var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
	var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

//				if(isAndroid == true) {
//					var height = document.body.clientHeight;
//					$("#body_margin").css('margin-top', -80 + "px");
//					$("#pullrefresh").css('height', height - 130 + "px");
//					$("#pullrefresh").css('margin-top', 130 + "px");
//					$("#pullrefresh").css('overflow', 'auto');
//				}
//				if(isiOS == true) {
//					var height = document.body.clientHeight;
//					$("#pullrefresh").css('overflow', ' hidden');
//					$("#pullrefresh").css('height', height - 190 + "px");
//					$("#pullrefresh").css('margin-top', 190 + "px");
//					$("#body_margin").css('margin-top', -50 + "px");
//				}
	auid = localStorage.getItem("auid");

//				if(state == 1) {
//					$("#hg").show();
//				}
	console.log(auid)
	$("#total_money").html(money);
	mui.app_request('POST', {
			"OPERATE_TYPE": "20002",
			"AUTH_ID": auid,
			"BEGIN": list_num,
			"SIZE": size,
			"FANSUSERID": userid,
			"STATE": state
		}, function(data) {
			if(data.RESULTCODE == "0") {
				var info = data.RESULTLIST;
				var fansInfo = data.fansInfo;

//							if(info.length < size) {
//								mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
//							} else {
//								mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
//							}

				if(!mui.isnull(fansInfo.header_img)) {
					$("#head_img").attr("src", booking.constants.ip + fansInfo.header_img);
				}
				if(!mui.isnull(fansInfo.username)) {
					$("#phone_num").html(fansInfo.username);
				}
				if(!mui.isnull(fansInfo.nickname)) {
					$("#nickname").html(fansInfo.nickname);
				}
				list_num = list_num + size;
				addlistNO(info);

				return;
			}
		},function(result) {
			if(result.RESULTCODE == "-1") {
				mui.toast(result.DESCRIPTION);
				return;
			} else {
				mui.toast("当前网络不给力");
				return;
			}
		});
});

//加载更多  
function listmore() {
	setTimeout(function() {
		mui.app_request('POST', {
				"OPERATE_TYPE": "20002",
				"AUTH_ID": auid,
				"BEGIN": list_num,
				"SIZE": size,
				"FANSUSERID": userid,
				"STATE": state
			}, function(data) {
				if(data.RESULTCODE == "0") {
					var info = data.RESULTLIST;
					if(info.length < size) {

						mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
					} else {
						mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
					}
					list_num = list_num + size;
					addlistNO(info);
					return;
				}
			},
			function(result) {
				if(result.RESULTCODE == "-1") {
					mui.toast(result.DESCRIPTION);
					return;
				} else {
					mui.toast("当前网络不给力");
					return;
				}
			});
	}, 1500)
}

function addlistNO(datas) {
	console.log(JSON.stringify(datas))
	var _html = "";
	var html_ = "";

	for(var i = 0; i < datas.length; i++) {

		_html += '	<div class="my-tabel">';
		_html += '<span>' + datas[i].create_time + '</span>';
		_html += '<span>' + datas[i].des + '</span>';
		_html += '<span class="red">' + datas[i].amount + '</span><div>';
	}
	$("#fans_value").append(_html);
}