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
$(function() {

	var u = navigator.userAgent;
	var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
	var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

//				if(isAndroid == true) {
//					var height = document.body.clientHeight;
//					$("#body_margin").css('margin-top', -80 + "px");
//					$("#pullrefresh").css('height', height - 300 + "px");
//					$("#pullrefresh").css('margin-top', 300 + "px");
//					$("#pullrefresh").css('overflow', 'auto');
//				}
//				if(isiOS == true) {
//					var height = document.body.clientHeight;
//					$("#pullrefresh").css('overflow', ' hidden');
//					$("#pullrefresh").css('height', height - 360 + "px");
//					$("#pullrefresh").css('margin-top', 270 + "px");
//					$("#body_margin").css('margin-top', -50 + "px");
//				}
	auid = localStorage.getItem("auid");
	if(!auid) {
		$("#nomessage").css("display", "block");
		mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
		return;
	}
	console.log(auid)
	

	mui.app_request('POST', {
			"OPERATE_TYPE": "10067",
			"AUTH_ID": auid,
			"BEGIN": list_num,
			"SIZE": size
		}, function(data) {
			if(data.RESULTCODE == "0") {
				var info = data.RESULTLIST.result;
				$("#fan_size").html(data.RESULTLIST.totalsize);
				$("#countAll").html(returnFloat(data.RESULTLIST.countAll))
				$("#countPerson").html(returnFloat(data.RESULTLIST.countPerson))
				$("#countShop").html(returnFloat(data.RESULTLIST.countShop))
				if(info.length == 0) {
					$("#nomessage").css("display", "block");
					return;
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
});

//加载更多  
function listmore() {
	setTimeout(function() {
		auid = localStorage.getItem("auid");
		if(!auid) {
			$("#nomessage").css("display", "block");
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
			return;
		}
		mui.app_request('POST', {
				"OPERATE_TYPE": "10067",
				"AUTH_ID": auid,
				"BEGIN": list_num,
				"SIZE": size
			}, function(data) {
				if(data.RESULTCODE == "0") {
					var list = data.RESULTLIST.result;
					console.log(JSON.stringify(list))
					addlistNO(list);
					list_num = list_num + size;
					if(list.length < size) {
						mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);

					} else {
						mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);

					}
				}
				return;
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
	var _html = "";
	var html_ = "";
	for(var i = 0; i < datas.length; i++) {
		_html += '<div class="fan_body" style="margin-top: 2px;">';
		_html += '<input type="hidden" class="attr" data-state="' + datas[i].state + '" data-id="' + datas[i].be_user_id + '" data-money="'+(datas[i].bring_income).toFixed(2)+'" />';
		_html += '<p class="position-p"><img src="' + booking.constants.ip + datas[i].header_img + '" class="portrait" />';
		
		_html += '</p>'
		_html += '<div class="fl">'
		if(datas[i].nickname) {
			if(datas[i].state == 1) {
				_html += '<p><span class="fan_name">' + datas[i].nickname + '</span><span class="mlr">|</span>' + datas[i].username + '<span class="span_shop">商户</span></p>';
			}else{
				_html += '<p><span class="fan_name">' + datas[i].nickname + '</span><span class="mlr">|</span>' + datas[i].username + '<span class="span_user">会员</span></p>';
			}
		} else {
			if(datas[i].state == 1){
				_html += '<p><span class="fan_name">' + datas[i].username + '</span><span class="span_shop">商户</span></p>';
			}else{
				_html += '<p><span class="fan_name">' + datas[i].username + '</span><span class="span_user">会员</span></p>';
			}
		}
		_html += '<p class="count_inandout" >带来收益<span class="red mr-10 fr">' + (datas[i].bring_income).toFixed(2) + '元</span></p>';
		_html += '<p class="count_inandout">'
		if(!mui.isnull(datas[i].createTime)) {
			_html += '<span class="fl">' + booking.dateUtil.getFormatDataByLong(datas[i].createTime) + '</span>'
		}
		_html += '</p></div>';
		_html += '</div>';
	}
	$("#fans_value").append(_html);
	mui("#fans_value").on("tap", ".fan_body", function() {
		var _inpt = this.querySelector(".attr");
		var state = _inpt.getAttribute("data-state");
		if(state != "1") {
			state = 0;
		}
		var userid = _inpt.getAttribute("data-id");
		var money = _inpt.getAttribute("data-money");
		var attrd = {
			"state": state,
			"userid": userid,
			"money":money
		}
	
		mui.openWindow({
			url: "my_fans_detail.html",
			id:"my_fans_detail",
			extras:  attrd
		});
		return;
	})

}