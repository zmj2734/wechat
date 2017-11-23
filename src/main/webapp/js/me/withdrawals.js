mui.init({
	swipeBack: true,
});
var auid = localStorage.getItem("auid");
var real = null;
var type;
var userType = null;
var case_type = null;
var pwd_word = null;
var account_balance = null;
var turnover = null;
$(function() {
	if(!PwdBox.inited) {
		PwdBox.init('', '../../img/pwd_keyboard.png', '请输入支付密码', '安全支付环境，请放心使用！');
		$(".notice").html("<p>安全支付环境，请放心使用！</p><a id='forget' class='forget'>忘记密码?</a>")
	}
	document.getElementById("forget").addEventListener('tap', function() {
		booking.closeAndOpenNewWindow("find_pwd.html", "find_pwd")
	})
	type = plus.webview.currentWebview().type;

	console.log("type:" + type)
	if(type == "10088" || type == "10089") {
		case_type = plus.webview.currentWebview().case_type;
	}

	mui.app_request('POST', {
		"OPERATE_TYPE": "10023",
		"AUTH_ID": auid //localStorage.getItem("auid")
	}, function(data) {
		console.log(JSON.stringify(data))
		if(data.RESULTCODE == "0") {
			userType = data.RESULTLIST.user_type;
			var cash_info = data.RESULTLIST.cash_info;
			real = data.RESULTLIST.ida_auth;
			pwd_word = data.RESULTLIST.my_base_info.pay_pwd;
			var my_shop_info = data.RESULTLIST.my_shop_info;
			var my_base_info = data.RESULTLIST.my_base_info;
			if(userType == 1) {
				if(!mui.isnull(my_base_info.account_balance)) {
					account_balance = (my_base_info.account_balance).toFixed(2)
				}
			} else {
				if(!mui.isnull(my_shop_info.account_balance)) {
					account_balance = (my_shop_info.account_balance).toFixed(2)
					turnover = (my_shop_info.turnover).toFixed(2)
					//$("#banlance").html((my_shop_info.account_balance).toFixed(2));
				}
			}
			
			if(cash_info.is_binding_alipay == "0") {
				$("#no_bind").show();
			} else {
				var num = cash_info.account_num;
				if(num.indexOf("@")>-1){
//								var allnum = num.split("@");
//								var num1 = num[0];
//								var num2 = num2[1];
//								if(num1.indexOf("www.")>-1){
//									num1 = num1.split("www.")[1];
//									num1 = num1.substr(0,3);
//								}
//								num2 = num2[1];
//								num = num1 + '*****@' + num2;
				}else{
					num = replacePhone(num)
				}
				$("#aliPayNO").html(num);
				$("#yes_bind").show();
			}
		}
		return;
	}, function(result) {
		return;
	});
	
	if(type == "10088") {
		$("#tip").html("提现金额需≥200，且为100的整数倍")
		if(!mui.isnull(account_balance)) {
			$("#fund").attr("placeholder", "可申请提现"+account_balance+"元")
		}
	} else if(type == "10089") {
		$("#tip").hide();
		if(!mui.isnull(turnover)) {
			$("#fund").attr("placeholder", "可申请提现"+turnover+"元")
		}
	} else {
		if(!mui.isnull(account_balance)) {
			$("#fund").attr("placeholder", "可申请提现"+account_balance+"元")
		}
		$("#tip").html("提现金额需≥100，且为100的整数倍")
	}
	
	
	document.getElementById("toappend").addEventListener("tap", function() {
		if(mui.isnull(pwd_word)) {
			mui.alert('您尚未设置支付密码，请前往“首页→我的→账号管理”设置支付密码。', '系统提示', function() {
				return;
			});
			return;
		}
		setDisabled("toappend"); //禁用按钮
		append_fund();
	});
	document.getElementById("detail").addEventListener('tap', function() {
		booking.closeAndOpenNewWindow("withdrawls_exp.html", "withdrawls_exp")
	});

	document.getElementById("bind_alipay").addEventListener('tap', function() {
		if(real == 0) {
			mui.toast("实名审核中...")
		} else if(real == -2) {
			var btnArray = ['去实名', '取消'];
			mui.confirm('只有实名用户可以绑定支付宝', '', btnArray, function(e) {
				if(e.index == 0) {
					booking.closeAndOpenNewWindow(
						'realname.html',
						'realname'
					)
				} else {
					return;
				}
			});
		} else {
			booking.closeAndOpenNewWindow(
				'bindAlipay.html',
				'bindAlipay'
			)
		}
	});

	function append_fund() {
		document.getElementById("fund").blur();
		var fund = parseInt(document.getElementById("fund").value);
		var funds = document.getElementById("fund").value;
		if(mui.isnull(funds)) {
			mui.toast("提现金额不能为空");
			remDisabled("toappend"); //恢复按钮为非禁用
			return;
		}

		console.log("userType:" + userType)

		if(type == "10089") {
			if(fund <= 2) {
				mui.toast("提现金额不足以支付手续费!");
				remDisabled("toappend"); //恢复按钮为非禁用
				return;
			}

			$("#tip").hide();
		} else if(type == "10088") {
			if(fund < 200 || fund % 100 != 0) {
				mui.toast("提现金额需≥200，且为100的整数倍。");
				remDisabled("toappend"); //恢复按钮为非禁用
				return;
			}

		} else {
			if(fund < 100 || fund % 100 != 0) {
				mui.toast("提现金额需≥100，且为100的整数倍。");
				remDisabled("toappend"); //恢复按钮为非禁用
				return;
			}
		}

		var yue = {
			"OPERATE_TYPE": type,
			"AUTH_ID": auid, //localStorage.getItem("auid")
			"AMOUNT": fund,
		}
		if(type == "10088" || type == "10089") {
			yue = {
				"OPERATE_TYPE": type,
				"AUTH_ID": auid, //localStorage.getItem("auid")
				"AMOUNT": fund,
				"CASH_TYPE": case_type
			}
		}
		console.log(JSON.stringify(yue));
		withdrawals(yue)
		
	}
})
function withdrawals(yue){
	//alert(22)
	PwdBox.show(function(res) {
		//console.log(JSON.stringify(res)) 
		if(res.status) {
			//重置输入
			var pay_pwd = res.password;
			console.log(pay_pwd)
			setTimeout(function(){
				
				mui.app_request('POST', {
					"OPERATE_TYPE": "10082",
					"AUTH_ID": auid, //localStorage.getItem("auid"),
					"PAY_PWD": pay_pwd,
				}, function(data) {
					console.log("000:" + JSON.stringify(data))
					if(data.RESULTCODE == "0") {
						if(data.RESULTLIST.is_ok == 1) {
							mui.app_request("Post", yue, function(data) {

								if(data.RESULTCODE == "0") {
									//关闭并重置密码输入
									//$("#pay_password").hide();
									setTimeout(function() {
										PwdBox.reset();
										mui.toast("申请成功，系统会尽快处理！");
										remDisabled("toappend"); //恢复按钮为非禁用    
										booking.closeAndOpenNewWindow(
											'mine.html',
											'mine'
										)
										return;
									}, 500)
									return;
								}
								return;
							}, function(result) {

								if(result.RESULTCODE == "-1") {
									PwdBox.reset();
									remDisabled("toappend");
									mui.toast(result.DESCRIPTION);
									return;
								} else {
									PwdBox.reset();
									remDisabled("toappend");
									mui.toast("当前网络不给力！");
									return;
								}
								//remDisabled("btn_submit");
							});

						} else {
							mui.toast("密码错误！");
							PwdBox.reset();
							withdrawals(yue)
							return;
						}
					}
				}, function(result) {
					console.log(JSON.stringify(result))
					mui.toast(result.DESCRIPTION);
				});
			},500)
		} else {
			PwdBox.reset();
			remDisabled("toappend");
			//alert(JSON.stringify(arguments));
		}
	}, remDisabled("toappend"))
}
function drawMoney() {
	var fund = parseInt(document.getElementById("fund").value);

	if(mui.isnull(fund)) {
		document.getElementById("fund").value = "";
		mui.toast("不能输入非法字符");
		return;
	}

	if(fund <= 1000) {
		document.getElementById("true_fund").innerHTML = fund - 2;
	} else {
		var more = fund - 1000;
		if(isNaN(more)) {
			document.getElementById("true_fund").innerHTML = "";
		} else {
			var money = (998 + more - (more * 0.0015)).toFixed(2);
			if(type == "10089") {
				if(fund - money > 27) {
					document.getElementById("true_fund").innerHTML = fund - 27;
					return;
				}
			}
			document.getElementById("true_fund").innerHTML = (998 + more - (more * 0.0015)).toFixed(2);
		}
	}

};