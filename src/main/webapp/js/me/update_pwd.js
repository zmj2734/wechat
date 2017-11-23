mui.init({
	swipeBack: true
});
var auid = null;
var userName = null;
$(function() {
	PwdBox.init('', 'img/pwd_keyboard.png', '请输入原密码', '安全支付环境，请放心使用！');
	$("h1.title").html("");
	PwdBox.show(function(res) {
		if(res.status) {
			var old_pwd = res.password;
			setTimeout(function() {
				oldpwd(old_pwd)
			}, 500)
		} else {
			alert(JSON.stringify(arguments));
		}
	});
	$(".icon-guanbi").hide();
	auid = localStorage.getItem("auid");
	 win = JSON.parse(localStorage.getItem("update_pwd_attr"));
	
	mui.app_request('POST', {
		"OPERATE_TYPE": "10023",
		"AUTH_ID": auid //localStorage.getItem("auid")
	}, function(data) {
		if(data.RESULTCODE == "0") {
			userName = data.RESULTLIST.my_base_info.username;
		}
		return;
	}, function(result) {
		return;
	});
});

function oldpwd(old_pwd) {
	mui.app_request('POST', {
		"OPERATE_TYPE": "10082",
		"AUTH_ID": auid, //localStorage.getItem("auid"),
		"PAY_PWD": old_pwd,
	}, function(data) {
		console.log(JSON.stringify(data))
		if(data.RESULTCODE == "0") {
			if(data.RESULTLIST.is_ok == 1) {
				setTimeout(function() {
					PwdBox.reset();
					$("h1.title").html("");
					var num_one = userName.substr(0, 3);
					var num_two = userName.substr(7, 11);
					userName = num_one + "****" + num_two;
					$("#text").html("请为账号" + userName).addClass("ccc");
					$("#tips").show();
					PwdBox.show(function(res) {
						if(res.status) {
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
				}, 500)
			} else {
				mui.toast("原密码错误！");
				PwdBox.reset();
				PwdBox.show(function(res) {
					if(res.status) {
						var old_pwd = res.password;
						setTimeout(function() {
							oldpwd(old_pwd)
						}, 500)
					} else {
						//alert(JSON.stringify(arguments));
					}
				});
				return;
			}
		}
	}, function(result) {
		console.log(JSON.stringify(result))
		mui.toast(result.DESCRIPTION);
	});
}

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
			//PwdBox.reset();
			mui.app_request('POST', {
				'OPERATE_TYPE': "10017",
				'AUTH_ID': auid,
				'PAY_PWD': new_pwd
			}, function(data) {
				if(data.RESULTCODE != -1) {
					setTimeout(function() {
						//PwdBox.reset();
						mui.alert('设置成功', function() {
							window.history.back();
							//mui.app_back(win.backId, true);
						});
					}, 500)
				}
			}, function(result) {
				if(result.RESULTCODE == -1) {
					mui.toast(result.DESCRIPTION)
				}
			});
		} else {
			//alert(JSON.stringify(arguments));
		}
	});
}