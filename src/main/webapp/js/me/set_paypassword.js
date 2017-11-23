mui.init({
	swipeBack: true
});
var auid = null;
var uuid = null;
var mobile = null;
var code = null;
var userName = null;
$(function() {
	PwdBox.init('', 'img/pwd_keyboard.png', '请输入6位支付密码', '安全支付环境，请放心使用！');

	$("h1.title").html("");

	$(".icon-guanbi").hide();
	auid = localStorage.getItem("auid");
	 win = JSON.parse(localStorage.getItem("set_paypassword_attr"));
	
	mui.app_request('POST', {
		"OPERATE_TYPE": "10023",
		"AUTH_ID": auid //localStorage.getItem("auid")
	}, function(data) {
		if(data.RESULTCODE == "0") {
			mobile = data.RESULTLIST.my_base_info.username;
			userName = data.RESULTLIST.my_base_info.username;
			var num_one = userName.substr(0, 3);
			var num_two = userName.substr(7, 11);
			userName = num_one + "****" + num_two;
			$("#phone").html(userName)
			$("#text").html("请为账号" + userName).addClass("ccc");
			$("#tips").show();
		}
		return;
	}, function(result) {
		return;
	});
	document.getElementById("up_send").addEventListener("tap", function() {
		$("input").blur();
		var send = document.getElementById("up_send");
		booking.smsTime_new(send);
		mui.app_request('POST', {
			"OPERATE_TYPE": "10001",
			"AUTH_ID": auid,
			"MOBILE": mobile,
			"B_TYPE": "55"
		}, function(data) {
			console.log(JSON.stringify(data))
			if(data.RESULTCODE == "0") {
				uuid = data.RESULTLIST.UUID;
			}
			return;
		}, function(data) {
			if(data.RESULTCODE == "-1") {
				mui.toast(data.DESCRIPTION);
			} else {
				mui.toast("当前网络不给力！");
			}
			return;
		});

	})
	document.getElementById("next").addEventListener("tap", function() {
		code = $("#code").val();
		if(mui.isnull(code) || code.length != 4 || mui.isnull(uuid)) {
			mui.toast("验证码错误！");
			return;
		}
		$("input").blur();
		mui.app_request('POST', {
			"OPERATE_TYPE": "20010",
			"AUTH_ID": auid,
			"MOBILE": mobile,
			"UUID": uuid,
			"SMS_CODE": code
		}, function(data) {
			console.log(JSON.stringify(data))
			if(data.RESULTCODE == "0") {
				$("#phoneCode").hide();
				$("#set_pwd").show();
				PwdBox.show(function(res) {
					if(res.status) {
						//重置输入
						var new_pwd = res.password;
						setTimeout(function() {
							PwdBox.reset();
							newpwd(new_pwd)
						}, 500)
						//关闭并重置密码输入
						//PwdBox.reset();
					} else {
						//alert(JSON.stringify(arguments));
					}
				});
			}
			return;
		}, function(data) {
			if(data.RESULTCODE == "-1") {
				mui.toast(data.DESCRIPTION);
			} else {
				mui.toast("当前网络不给力！");
			}
			return;
		});

	})
	document.getElementById("confirm").addEventListener("tap", function() {
		booking.closeAndOpenNewWindow(win.backId + ".html", win.backId);

	})
});

function newpwd(new_pwd) {
	//$("h1.title").html("请重复6位支付密码")
	$("#text").html("请再次输入").removeClass("ccc");
	$("#tips").hide();
	PwdBox.show(function(res) {
		if(res.status) {
			//重置输入
			var repwd = res.password;
			console.log("newpwd:" + new_pwd)
			console.log("repwd:" + repwd)
			if(new_pwd != repwd) {
				mui.toast("两次输入的密码不一致！");
				return;
			}

			mui.app_request('POST', {
				'OPERATE_TYPE': "20004",
				'AUTH_ID': auid,
				'PAY_PWD': new_pwd
			}, function(data) {
				console.log(JSON.stringify(data))
				if(data.RESULTCODE != -1) {
					setTimeout(function() {
						PwdBox.reset();
						$("#set_pwd_yes").show();
						//									mui.alert('设置成功', function() {
						//										mui.app_back(win.backId, true);
						//									});
					}, 500)

				}
			}, function(result) {
				console.log(JSON.stringify(result))
				$("#phoneCode").show();
				$("#set_pwd").hide();
				$("#text").html("请为账号" + userName).addClass("ccc");
				$("#tips").show();
				if(result.RESULTCODE == -1) {
					mui.toast(result.DESCRIPTION)
				}
			});
		} else {
			//alert(JSON.stringify(arguments));
		}
	});
}