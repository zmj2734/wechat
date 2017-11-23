var my_base_info = null;
var voucher_info = null;
var profit_info = null;
var my_bz_info = null;
var isreal = false;
var auid = localStorage.getItem("auid");
var type = 0;
var state = null;
var shop_apply_info = null;
var my_shop_info = null;
var is_apply_state = null;
var is_agent = null;
var isLogin = null;
var level = 0;

mui.plusReady(function() {
	mui.app_request("Post", {
		"OPERATE_TYPE": "10081",
		"AUTH_ID": localStorage.getItem("auid"),
	}, function(result) {
		console.log(JSON.stringify(result))
		if(result.RESULTCODE == 0) {

			if(result.RESULTLIST.is_login == 1) {
				isLogin = 1;
				return;
			} else {
				isLogin = 0;
				mui.alert('您的账号已在其他设备登录，请重新登录。', '安全提示', function() {
					localStorage.removeItem("auid");
					booking.closeAndOpenNewWindow("../login/login.html", "login");
				});
				return;
			}
		}

	}, function(result) {
		isLogin = 0;
		if(result.RESULTCODE == -1) {
			mui.alert('您的账号已在其他设备登录，请重新登录。', '安全提示', function() {
				localStorage.removeItem("auid");
				booking.closeAndOpenNewWindow("../login/login.html", "login");
			});
			return;
		} else {
			isLogin = 1;
			return;

		}
	});

	if(isLogin != 1) {
		return;
	}
	plus.webview.currentWebview().setStyle({
		scrollIndicator: 'none'
	});
	console.log(auid)
	//Android双击home键退出应用
	mui.back = function() {
		if(!first) {
			first = new Date().getTime();
			mui.toast('再按一次退出程序');
			setTimeout(function() {
				first = null;
			}, 1000);
		} else {
			if(new Date().getTime() - first < 1000) {

				plus.runtime.quit();
			}
		}
	};

	mui(".navlist").on("tap", "a", function() {

		var id = $(this).attr("id");
		var data = $(this).attr("data");
		var url = "../" + id + "/" + data + ".html";
		if(id == "me") {
			return;
		} else {
			booking.closeAndOpenNewWindow(url, id);
		}
	})
	
	//判断审核状态
	mui.app_request('POST', {
		"OPERATE_TYPE": "10075",
		"AUTH_ID": auid
	}, function(data) {
		if(data.RESULTCODE == "0") {
			var data = data.RESULTLIST;
			state = data.apply_state;
			if(data.apply_user_type == "3" && data.apply_state == "0" && data.current_user_type == "2") {
				is_apply_state = 1;
			}
			if(data.apply_user_type == "2" && data.apply_state == "0" && data.current_user_type == "1") {
				is_apply_state = 2;
			}
		}
		return;
	}, function(result) {

		mui.toast("当前网络不给力");
		return;
	});

	//
	mui.app_request('POST', {
		"OPERATE_TYPE": "10023",
		"AUTH_ID": auid
	}, function(data) {
		console.log(JSON.stringify(data))
		if(data.RESULTCODE == "0") {
			my_base_info = data.RESULTLIST.my_base_info;
			voucher_info = data.RESULTLIST.voucher_info;
			profit_info = data.RESULTLIST.profit_info;
			my_bz_info = data.RESULTLIST.my_bz_info;
			type = data.RESULTLIST.user_type;
			is_agent = data.RESULTLIST.is_agent;
			level = data.RESULTLIST.userMember.level;
			
			if(is_agent == 1) {
				$("#user-license").show();
				$("#bus_license").show();
			}
			if(type != 1) {

			} else {
				if(mui.isnull(level)) {
					$("#user-level").html("普通会员");
				}else{
					$("#user-level").html("VIP"+level);
				}
				
						
				
				//个人状态
				if(data.RESULTLIST.ida_auth == "0") {
					is_apply_state = 3;
					
				}
				if(data.RESULTLIST.ida_auth == "-2") {
					document.getElementById("user-rename").addEventListener("tap", function() {
						booking.closeAndOpenNewWindow("realname.html", "realname");
					})
				}
				
				if(data.RESULTLIST.ida_auth == "1") {
					isreal = true;
					is_apply_state = 4;
				}
				if(!mui.isnull(my_base_info.header_img)) {
					$("#user-head").attr("src", booking.constants.ip + my_base_info.header_img);
				}

				//				if(!mui.isnull(my_base_info.mobile)) {
				//					$("#mine_phone_num").html(my_base_info.mobile);
				//				}
				if(!mui.isnull(my_base_info.nickname)) {
					var myname = my_base_info.nickname;
					if(myname.length > 5) {
						myname = myname.substr(0, 5);
						myname = myname + '...'
					}
					$("#user-name").html(myname);
				}
				if(data.RESULTLIST.ida_auth != "1") {
					$("#user-rename").html("未实名");
				} else {
					$("#user-rename").html("已实名");
				}

				if(!mui.isnull(profit_info.today_profit)) {
					$("#today_profit").html("+" + returnFloat(Number(profit_info.today_profit) + Number(profit_info.today_bz_income)));
				}
				//				if(!mui.isnull(profit_info.today_bz_income)) {
				//					$("#today_amount").html(profit_info.today_bz_income);
				//				}

				if(!mui.isnull(my_base_info.account_balance)) {
					$("#user_banlance").html(returnFloat(my_base_info.account_balance));
				}
				if(!mui.isnull(voucher_info.voucher_count)) {
					$("#user-queued-count").html(voucher_info.voucher_count);
				}
				if(!mui.isnull(profit_info.total_profit)) {

					$("#profit").html(returnFloat(profit_info.total_profit));
				}
				if(!mui.isnull(my_base_info.gold_count)) {
					$("#gold_count").html(my_base_info.gold_count);
				}

				if(state == 0) {
					$("#user-state").html("审核中");
				} else {
					$("#user-state").html("免费签约");
				}

				$("#my_user").css("display", "inline-block");
			}

		}
		return;
	}, function(result) {

		mui.toast("当前网络不给力");
	});

	//普通用户
	document.getElementById("user-detail").addEventListener('tap', function() {
		booking.closeAndOpenNewWindow(
			'account_ment.html',
			'account_ment'
		)
	});
	//消费记录
	document.getElementById("user-record").addEventListener('tap', function() {
		booking.closeAndOpenNewWindow(
			'record.html',
			'record'
		)
	});
	//补贴申请记录
	document.getElementById("user-btsq").addEventListener('tap', function() {
		booking.closeAndOpenNewWindow(
			'account_record.html',
			'account_record'
		)
	});
	//商城消费金
	document.getElementById("user-gold").addEventListener('tap', function() {
		document.getElementById("refuse").style.display = "block";
	});
	document.getElementById("refuse_no").addEventListener('tap', function() {
		document.getElementById("refuse").style.display = "none";
	});
	//我的消费券
	document.getElementById("user-queued").addEventListener('tap', function() {
		var attrd = {
			type: type,
			backId: "mine"
		}
		booking.closeAndOpenNewWindowHaveAttr("voucher_mine.html", "voucher_mine", attrd);
	});

	//我的粉丝
	document.getElementById("user-fans").addEventListener('tap', function() {
		mui.openWindow({
			url: "my_fans.html",
			id: "my_fans",
		})
	});

	//认证商家
	document.getElementById("user-to-shop").addEventListener('tap', function() {
		if(is_apply_state == 3) {
			mui.toast("实名审核中...");
			return false;
		} else {
			if(type == 1) {
				if(state == 0) {
					mui.toast("您的申请正在审核中...");
					return;
				}
				var attrValue = {
					isreal: isreal,
					backId: "mine"
				}
				booking.closeAndOpenNewWindowHaveAttr(
					'mar_cert.html',
					'mar_cert',
					attrValue
				)
			}
		}
	});
	document.getElementById("user-invit").addEventListener("tap", function() {
		booking.closeAndOpenNewWindow(
			'invitation.html',
			'invitation',
		)
	})

	//帮助中心
	document.getElementById("user-help").addEventListener('tap', function() {
		booking.closeAndOpenNewWindow('../helpcenter/helpcenter.html', 'helpcenter');
	});
	

});