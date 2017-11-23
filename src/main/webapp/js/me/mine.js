mui.init();

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
var user_code = null;
var apply_update_state = null;
$(function() {
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

	//获取用户状态
	mui.app_request('POST', {
		"OPERATE_TYPE": "20027",
		"AUTH_ID": auid
	}, function(data) {
		if(data.RESULTCODE == "0") {
			type = data.RESULTLIST.user_type;

			if(type == 3) {
				$("#shop_info").show();
			} else {
				$("#user_info").show();
			}
		}
		return;
	}, function(result) {
		if(result.RESULTCODE == "-1") {
			mui.toast(result.DESCRIPTION);
		} else {
			mui.toast("当前网络不给力。");
		}
	})

	//获取商户信息
	mui.app_request('POST', {
		"OPERATE_TYPE": "20023",
		"AUTH_ID": auid
	}, function(data) {
		if(data.RESULTCODE == "0") {
			my_bz_info = data.RESULTLIST.my_bz_info;
			$("#user-day-zz").html(my_bz_info.bz_inGroup_count);
		}
		return;
	}, function(result) {
		if(result.RESULTCODE == "-1") {
			mui.toast(result.DESCRIPTION);
		} else {
			mui.toast("当前网络不给力。");
		}
	}, true)

	

	//VOUCHER_INFO
	mui.app_request('POST', {
		"OPERATE_TYPE": "20024",
		"AUTH_ID": auid
	}, function(data) {
		if(data.RESULTCODE == "0") {
			voucher_info = data.RESULTLIST.voucher_info;
			//商家
			if(type != 1) {
				$("#bus_hava_count").html(voucher_info.voucher_count);
			}
			//个人
			else {
				$("#user-queued-count").html(voucher_info.voucher_count);
			}
		}
		return;
	}, function(result) {
		if(result.RESULTCODE == "-1") {
			mui.toast(result.DESCRIPTION);
		} else {
			mui.toast("当前网络不给力。");
		}
	}, true)

	//base_info
	mui.app_request('POST', {
		"OPERATE_TYPE": "20022",
		"AUTH_ID": auid
	}, function(data) {
		if(data.RESULTCODE == "0") {

			my_base_info = data.RESULTLIST.my_base_info;
			is_agent = data.RESULTLIST.is_agent;
			level = data.RESULTLIST.userMember.level;
			var ida_auth = data.RESULTLIST.ida_auth;
			user_code = my_base_info.qr_code_url;
			if(is_agent == 1) {
				$("#user-license").show();
				$("#bus_license").show();
			}
			if(type == 3) {
				if(mui.isnull(level) || level == 0) {
					$("#bus-level").html("普通会员");
				} else {
					$("#bus-level").html("VIP" + level);
				}

				if(!mui.isnull(my_base_info.header_img)) {
					$("#bus_head").attr("src", booking.constants.ip + my_base_info.header_img);
				}

				if(!mui.isnull(my_base_info.nickname)) {
					var myname = my_base_info.nickname;
					if(myname.length > 5) {
						myname = myname.substr(0, 5);
						myname = myname + '...'
					}
					$("#bus-name").html(myname);
				} else {
					$("#bus-name").html(my_base_info.real_name);
				}
				

			} else {
				if(mui.isnull(level) || level == 0) {
					$("#user-level").html("普通会员");
				} else {
					$("#user-level").html("VIP" + level);
				}
				//个人状态
				if(data.RESULTLIST.ida_auth == "0") {
					$("#user-rename").html("实名审核中");
					$("#user-rename").removeClass("my-rename").addClass("my-shenhe");
					is_apply_state = 3;

				}
				if(data.RESULTLIST.ida_auth == "-2") {
					$("#user-rename").html("未实名");
					document.getElementById("user-rename").addEventListener("tap", function() {
						booking.closeAndOpenNewWindow("realname.html", "realname");
					})
				}
				if(data.RESULTLIST.ida_auth == "1") {
					$("#user-rename").html("已实名");
					$("#user-rename").removeClass("my-shenhe").addClass("my-rename");
					isreal = true;
					is_apply_state = 4;
				}
				if(!mui.isnull(my_base_info.header_img)) {
					$("#user-head").attr("src", booking.constants.ip + my_base_info.header_img);
				}

				if(!mui.isnull(my_base_info.nickname)) {
					var myname = my_base_info.nickname;
					if(myname.length > 5) {
						myname = myname.substr(0, 5);
						myname = myname + '...'
					}
					$("#user-name").html(myname);
				} else {
					if(isreal) {
						$("#user-name").html(my_base_info.real_name);
					} else {
						var mobile = my_base_info.mobile;
						var newMobile = mobile.substring(0, 4) + '****' + mobile.substring(8, 11);
						$("#user-name").html(newMobile);
					}

				}



				if(!mui.isnull(my_base_info.account_balance)) {
					$("#user_banlance").html(returnFloat(my_base_info.account_balance));
				}
				if(!mui.isnull(my_base_info.gold_count)) {
					$("#gold_count").html(my_base_info.gold_count);
				}
				if(state == 0) {
					$("#user-shenhe").html("商户认证审核中");
					$("#user-shenhe").show();
					$("#user-state").html("审核中");
				} else if(state == -1) {
					$("#user-state").html("申请被驳回，请修改");
				}else{
					$("#user-state").html("免费签约");
				}
				
				

			}

		}
		return;
	}, function(result) {
		if(result.RESULTCODE == "-1") {
			mui.toast(result.DESCRIPTION);
		} else {
			mui.toast("当前网络不给力。");
		}
	}, true)

	//收益信息
	mui.app_request('POST', {
		"OPERATE_TYPE": "20026",
		"AUTH_ID": auid
	}, function(data) {
		if(data.RESULTCODE == "0") {
			profit_info = data.RESULTLIST;
			if(type == 3) {
				var today_profit = parseFloat(profit_info.today_profit);
				if(today_profit > 0){
						$("#bus-day-bt").html("+" + returnFloat(today_profit));
				}
				if(!mui.isnull(profit_info.total_profit)) {
					$("#bus-day-ze").html(returnFloat(profit_info.total_profit));
				}
			} else {
				
				var today_profit = parseFloat(profit_info.today_profit);
				if(today_profit > 0){
					$("#user-day-bt").html("+" + returnFloat(today_profit));
				}
				
				if(!mui.isnull(profit_info.total_profit)) {
					$("#user-day-ze").html(returnFloat(profit_info.total_profit));
				}
			}
		}
		return;
	}, function(result) {
		if(result.RESULTCODE == "-1") {
			mui.toast(result.DESCRIPTION);
		} else {
			mui.toast("当前网络不给力。");
		}
	}, true)

	if(type == 3) {
		//店铺信息
		mui.app_request('POST', {
			"OPERATE_TYPE": "20025",
			"AUTH_ID": auid
		}, function(data) {
			if(data.RESULTCODE == "0") {
				console.log(JSON.stringify(data))
				my_shop_info = data.RESULTLIST.my_shop_info;
				apply_update_state = data.RESULTLIST.apply_update_state;
				if(!mui.isnull(my_shop_info.account_balance)) {
					$("#bus_banlance").html(returnFloat(my_shop_info.account_balance));
				}
				$("#shop_true_name").html(my_shop_info.shop_name);
				$("#bus_total_turnover").html(returnFloat(my_shop_info.turnover));
				$("#bus_gold_count").html(my_shop_info.gold_count);
				$("#bus_today_turnover").html(returnFloat(my_shop_info.view_today_turnover));
				$("#bus_today_bi").html(my_shop_info.view_today_pay_count);
			}
			return;
		}, function(result) {
			if(result.RESULTCODE == "-1") {
				mui.toast(result.DESCRIPTION);
			} else {

				mui.toast("当前网络不给力。");
			}
		}, true)
	}
	//

	document.getElementById("user_myprofit").addEventListener('tap', function() {
		mui.openWindow({
			url: "myprofit_sub.html",
			id: "myprofit_sub",
		})
	});
	document.getElementById("user_select_type").addEventListener('tap', function() {

		var attrd = {
			status: 1,
			backId: "mine"
		}
		localStorage.setItem("my_accountss_attr", JSON.stringify(attrd));
		booking.closeAndOpenNewWindowHaveAttr(
			'../index/my_accountss.html',
			'my_accountss',
			attrd
		)
	});

	document.getElementById("user_banlance-more").addEventListener('tap', function() {
		var attrd = {
			"isreal": isreal,
			"state": is_apply_state,
			"money": my_base_info.account_balance,
			"backId": "mine"
		}
		localStorage.setItem("banlance_sub_attr", JSON.stringify(attrd));
		booking.closeAndOpenNewWindowHaveAttr("banlance_sub.html", "banlance_sub", attrd)

	});

	//普通用户
	document.getElementById("user-detail").addEventListener('tap', function() {
		booking.closeAndOpenNewWindow(
			'account_ment.html',
			'account_ment'
		)
	});

//				//消费记录
//				
//				document.getElementById("user-record").addEventListener('tap', function() {
//					booking.closeAndOpenNewWindow(
//						'record.html',
//						'record'
//					)
//				});
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
    	localStorage.setItem("voucher_mine_attr", JSON.stringify(attrd));
		booking.closeAndOpenNewWindowHaveAttr("voucher_mine.html", "voucher_mine", attrd);
	});

	//我的粉丝
	document.getElementById("user-fans").addEventListener('tap', function() {
		mui.openWindow({
			url: "my_fans.html",
			id: "my_fans",
		})
	});
	
	document.getElementById("user_abaod").addEventListener("tap",function(){
		booking.closeAndOpenNewWindow("about_us.html","about_us")
	})
	document.getElementById("bus_abaod").addEventListener("tap",function(){
		booking.closeAndOpenNewWindow("about_us.html","about_us")
	})
	
	document.getElementById("user-code").addEventListener("tap", function() {
		var attrd = {
			type: type,
			user_id: my_base_info.id,
			backId: "mine"
		}
		localStorage.setItem("qrcode_attr", JSON.stringify(attrd));
		booking.closeAndOpenNewWindowHaveAttr("qrcode.html", "qrcode");
	})

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
				}else if(state == -1){
					var attrValue = {
						isreal: isreal,
						backId: "mine"
					}
					booking.closeAndOpenNewWindowHaveAttr(
						'en_mer_data.html',
						'en_mer_data',
						attrValue
					)
				}else{
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
		}
	});
	document.getElementById("user-invit").addEventListener("tap", function() {
		var addrd = {
			"user_code": user_code
		}
    	localStorage.setItem("invitation_attr", JSON.stringify(attrd));
		booking.closeAndOpenNewWindowHaveAttr(
			'invitation.html',
			'invitation',
			addrd
		)
	})

	//帮助中心
	document.getElementById("user-help").addEventListener('tap', function() {
		booking.closeAndOpenNewWindow('../helpcenter/helpcenter.html', 'helpcenter');
	});

	///商家

	document.getElementById("bus_detail").addEventListener('tap', function() {
		booking.closeAndOpenNewWindow(
			'bus_accountment.html',
			'bus_accountment'
		)
	});

	document.getElementById("bus_code").addEventListener("tap", function() {
		var attrd = {
			type: type,
			user_id: my_base_info.id,
			backId: "mine"
		}
    	//localStorage.setItem("qrcode_attr", JSON.stringify(attrd));
		booking.closeAndOpenNewWindowHaveAttr("qrcode.html", "qrcode");
	})
 
	document.getElementById("bus_myprofit").addEventListener('tap', function() {
		booking.closeAndOpenNewWindow("bus_profit_sub.html", "bus_profit_sub");
	});
	document.getElementById("bus_banlance_info").addEventListener('tap', function() {
		attrd = {
			"isreal": isreal,
			"state": is_apply_state,
			"money": my_base_info.account_balance,
			"backId": "mine"
		}
		localStorage.setItem("banlance_sub_attr", JSON.stringify(attrd));
		booking.closeAndOpenNewWindowHaveAttr("banlance_sub.html", "banlance_sub", attrd);
	});

	document.getElementById("shop_turnover").addEventListener("tap", function() {

		booking.closeAndOpenNewWindow(
			'turnover_sub.html',
			'turnover'
		)
	})
//				document.getElementById("bus_record").addEventListener("tap", function() {
//					booking.closeAndOpenNewWindow(
//						'record.html',
//						'record'
//					)
//				})


	document.getElementById("shop_true_name_on").addEventListener("tap", function() {
		if(apply_update_state != 0) {
			booking.closeAndOpenNewWindow(

				'en_mer_data_ed.html',
				'en_mer_data_ed'
			);
		} else {
			mui.toast("资料审核中，请等待");
			return;
		}

	})

	document.getElementById("shop_account").addEventListener('tap', function() {
		booking.closeAndOpenNewWindow("account_record_sub.html", "account_record_sub");
//		mui.openWindow({
//			url: "account_record_sub.html",
//			id: "account_record_sub",
//		})
	});

	//商城消费金
	document.getElementById("bus-gold").addEventListener('tap', function() {
		document.getElementById("refuse").style.display = "block";
	});

	document.getElementById("bus-queued").addEventListener("tap", function() {
		var attrd = {
			type: type,
			backId: "mine"
		}
		localStorage.setItem("voucher_mine_attr", JSON.stringify(attrd));
		booking.closeAndOpenNewWindowHaveAttr("voucher_mine.html", "voucher_mine", attrd);
	})

	document.getElementById("bus_fans").addEventListener('tap', function() {
		mui.openWindow({
			url: "my_fans.html",
			id: "my_fans",
		})
	});
	document.getElementById("user_license").addEventListener('tap', function() {
		mui.openWindow({
			id: 'agency_income',
			url: 'agency_income.html'
		});
	});

	document.getElementById("bus_license").addEventListener('tap', function() {
		mui.openWindow({
			id: 'agency_income',
			url: 'agency_income.html'
		});
	});
	document.getElementById("bus_invitation").addEventListener('tap', function() {
		var attrd = {
			"user_code": user_code
		}
		localStorage.setItem("invitation_attr", JSON.stringify(attrd));
		booking.closeAndOpenNewWindowHaveAttr(
			'invitation.html',
			'invitation',
			attrd
		)
	});

	document.getElementById("bus_help").addEventListener('tap', function() {
		booking.closeAndOpenNewWindow('../helpcenter/helpcenter.html', 'helpcenter');
	});

});