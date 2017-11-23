mui.init({
	swipeBack:true,
	pullRefresh: {
		container: "#pullrefresh", //待刷新区域标识
		up: {
			contentrefresh: "正在加载...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
			callback: fundmore, //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
		}
	}
});
var contentWebview = null;
var ida_auth = null;
var bind_pay = null;
var bind_bank = null;
var type = null;
var pwd_word = null;
var auid = localStorage.getItem("auid");
var list_num = 0;
$(function() {
	mui.app_request('POST', {
		"OPERATE_TYPE": "10023",
		"AUTH_ID": auid
	}, function(data) {
		if(data.RESULTCODE == "0") {
			var cash_info = data.RESULTLIST.cash_info;
			var my_base_info = data.RESULTLIST.my_base_info;
			ida_auth = data.RESULTLIST.ida_auth;
			bind_pay = cash_info.is_binding_alipay;
			pwd_word = my_base_info.pay_pwd;
		}
		return;
	}, function(result) {
		mui.toast("当前网络不给力");
	});

	mui.app_request('POST', {
		"OPERATE_TYPE": "10056",
		"AUTH_ID": auid
	}, function(data) {
		if(data.RESULTCODE == "0") {
			bind_bank = data.is_bind;
		}
		return;
	}, function(result) {
		mui.toast(result.DESCRIPTION);
	});
	document.getElementById("with_money").addEventListener("tap", function() {
		var btnArray = [{
			title: "支付宝"
		}, {
			title: "银行卡"
		}];
		plus.nativeUI.actionSheet({
			title: "选择提现渠道",
			cancel: "取消",
			buttons: btnArray
		}, function(e) {
			var index = e.index;

			switch(index) {
				case 0:
					break;
				case 1:
					if(ida_auth == 1) {
						if(bind_pay == "0") {
							mui.confirm("为保障您的账户安全，请绑定本人的支付宝账号。", function(e) {
								if(e.index == 0) {
									return;
								} else {
									booking.closeAndOpenNewWindow("bindAlipay.html", "bindAlipay");
									return;
								}

							}, "提示", ["取消", "去绑定"]);
							return;
						} else if(mui.isnull(pwd_word)) {
							mui.confirm("您还未设置支付密码，是否前往设置？", function(e) {
								if(e.index == 0) {
									return;
								} else {
									booking.closeAndOpenNewWindow("set_paypassword.html", "set_paypassword");
									return;
								}

							}, "提示", ["取消", "立即前往"]);
							return;
						} else {

							var attrd = {
								"type": "10089",
								"case_type": 2
							}
							booking.closeAndOpenNewWindowHaveAttr("withdrawals.html", "withdrawals", attrd);
						}

					} else if(ida_auth == 0) {
						mui.toast("实名审核中...")
						return;
					} else if(ida_auth == -2) {
						mui.confirm("为保障您账户安全，请先完成身份认证。", function(e) {
							if(e.index == 0) {
								return;
							} else {
								booking.closeAndOpenNewWindow("realname.html", "realname");
								return;
							}

						}, "提示", ["取消", "去认证"]);
					}
					break;
				case 2:
					if(ida_auth == 1) {
						if(bind_bank == "0") {
							mui.confirm("为保障您能顺利提现，请完成绑定银行卡。", function(e) {
								if(e.index == 0) {
									return;
								} else {
									booking.closeAndOpenNewWindow("bindBankCard.html", "bindBankCard");
									return;
								}

							}, "提示", ["取消", "去绑定"]);
							return;
						} else if(mui.isnull(pwd_word)) {
							mui.confirm("您还未设置支付密码，是否前往设置？", function(e) {
								if(e.index == 0) {
									return;
								} else {
									booking.closeAndOpenNewWindow("set_paypassword.html", "set_paypassword");
									return;
								}

							}, "提示", ["取消", "立即前往"]);
							return;
						} else {
							booking.closeAndOpenNewWindow("bus_turnoverwals.html", "bus_turnoverwals");
						}

					} else if(ida_auth == 0) {
						mui.toast("实名审核中...")
						return;
					} else if(ida_auth == -2) {
						mui.confirm("为保障您账户安全，请先完成身份认证。", function(e) {
							if(e.index == 0) {
								return;
							} else {
								booking.closeAndOpenNewWindow("realname.html", "realname");
								return;
							}

						}, "提示", ["取消", "去认证"]);
					}
					break;
			}

		});

	})
	
	
	
	var u = navigator.userAgent;
	var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
	var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

	if(isAndroid == true) {
		var height = document.body.clientHeight;
		$("#pullrefresh").css('overflow', 'auto');
		$("#body_margin").css('margin-top', -34 + "px");
		$("#pullrefresh").css('height', height - 180 + "px");
		$("#pullrefresh").css('margin-top', 180 + "px");
	}
	if(isiOS == true) {
		var height = document.body.clientHeight;
		$("#pullrefresh").css('overflow', ' hidden');
		$("#pullrefresh").css('height', height - 150 + "px");
		$("#pullrefresh").css('margin-top', 196 + "px");
		$("#body_margin").css('margin-top', -50 + "px");
	}
	if(!auid) {
		$("#nomessage").css("display", "block");
		mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
		return;
	}
	mui.app_request('POST', {
		"OPERATE_TYPE": "10059",
		"AUTH_ID": auid,
		"BEGIN": list_num,
		"SIZE": "10"
	}, function(data) {
		if(data.RESULTCODE == "0") {
			$("#money").html(data.RESULTLIST.total_amount)
			var dsa = '<div class="banlance_info" style="margin-top: -10px;"> <p class="account">营业额(元)</p><p class="ban_price">&yen;<span>' + data.RESULTLIST.total_amount + '</span></p></div>'
			//$("#messages").append(dsa)
			var list = data.RESULTLIST.result;
			listData(list);
			list_num = list_num + 10;
		}
		return;
	}, function(result) {
		if(result.RESULTCODE == "-1") {
			mui.toast(result.DESCRIPTION);
		} else {
			mui.toast("当前网络不给力");
		}
		return;
	});
})
//加载更多  
function fundmore() {
	setTimeout(function() {
		auid = localStorage.getItem("auid");
		if(!auid) {
			$("#nomessage").css("display", "block");
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
			return;
		}
		if(auid) {
			mui.app_request('POST', {
				"OPERATE_TYPE": "10059",
				"AUTH_ID": auid,
				"BEGIN": list_num,
				"SIZE": "10"
			}, function(data) {
				if(data.RESULTCODE == "0") {

					var list = data.RESULTLIST.result;
					listData(list);
					list_num = list_num + 10;
					if(list.length < 1) {
						mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
					} else {
						mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
					}
				}
				return;
			}, function(result) {
				if(result.RESULTCODE == "-1") {
					mui.toast(result.DESCRIPTION);
				} else {
					mui.toast("当前网络不给力");
				}
				return;
			});
		}
	}, 1500);
}

function getDate(a) {
	if(!auid) {
		$("#nomessage").css("display", "block");
		mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
		return;
	}
	var date = new Date(a);
	//alert(a);
	return a.substring(0, 10);
}

function listData(list) {
	var _html = "";
	for(var i = 0; i < list.length; i++) {
		_html += '<div class="with_content">';
		_html += '<div class="left_time">';
		_html += '<p><span class="sub_type">' + list[i].des + '</span></p>';
		_html += '<span><span class="get_time">' + list[i].create_time + '</span></span>';
		_html += "</div>";
		_html += '<div class="fr">';
		_html += '<p><span class="profit">' + list[i].amount + '</span></p>';
		_html += '</div></div>';
	}
	$("#messages").append(_html);
}