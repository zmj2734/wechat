var time = 59;
var timer;
$(function() {
	var uuid;
	var wechatName = localStorage.wechatName;
	var wechatHead = localStorage.wechatHead;
	var openId = localStorage.getItem("auid") ;
	$("#phone").focus();
	$("#wechatHead").attr("src", wechatHead);
	$("#wechatName").html(wechatName);
	$("#phone").blur(function() {
		var phone = $(this).val();
		if (!phone) {
			mui.toast("请输入手机号");
			return;
		}
		if (!booking.validate_mobile(phone)) {
			mui.toast("手机号有误请重试");
			$(this).val("");
			return;
		}
		mui.app_request('POST', {
			"OPERATE_TYPE" : "10076",
			"MOBILE" : phone
		}, function(data) {
			if (data.RESULTCODE == "0") {
				var is_bind = data.RESULTLIST.is_bind;
				if (is_bind == 0 || is_bind == "0") {
					$("#recommendDiv").show();
				} else {
					$("#recommendDiv").hide();
				}
			}
		}, function(data) {
			if (data.RESULTCODE == "-1") {
				mui.toast(data.DESCRIPTION);
			} else {
				mui.toast("当前网络不给力！");
			}
		}, true);
	});

	$("#getCode").click(function() {
		var phone = $("#phone").val();
		if (!phone) {
			mui.toast("请输入手机号");
			return;
		}
		if (!booking.validate_mobile(phone)) {
			mui.toast("手机号有误请重试");
			$("#phone").val("");
			return;
		}
		mui.toast("验证码发送中");
		$(this).attr("disabled", "true");
		mui.app_request('POST', {
			"OPERATE_TYPE" : "10001",
			"MOBILE" : phone,
			"B_TYPE" : "10"
		}, function(data) {
			if (data.RESULTCODE == "0") {
				uuid = data.RESULTLIST.UUID;
				codeTime();
			}
		}, function(data) {
			if (data.RESULTCODE == "-1") {
				mui.toast(data.DESCRIPTION);
			} else {
				mui.toast("当前网络不给力！");
			}
		}, true);
	})

	$("#login").click(function() {
		var checkBox = $("#checkboxID").is(":checked");
		var phone = $("#phone").val();
		var recommand = $("#recommend").val();
		var code = $("#code").val();
		if (!checkBox) {
			mui.toast("请阅读并勾选注册协议");
			return;
		}
		if (!booking.validate_mobile(phone)) {
			mui.toast("手机号有误请重试");
			return;
		}
		if (!mui.isnull(recommand)) {
			if (!booking.validate_mobile(recommand)) {
				mui.toast("推荐人手机号有误");
				return;
			}
		}
		if (mui.isnull(code)) {
			mui.toast("验证码不能为空");
			return;
		}
		if (mui.isnull(uuid)) {
			mui.toast("请先获取验证码");
			return;
		}
		mui(this).button('loading') ;
		$(this).attr("disabled", "disabled");
		checkBind(phone,code,recommand,uuid) ;
	})

	/**
	 * 检查该电话号码是否已绑定
	 * @param phone
	 * @param code
	 * @param recommand
	 * @param uuid
	 * @returns
	 */
	function checkBind(phone,code,recommand,uuid) {
		$.ajax({
			url : wechat.baseUrl + "/user/checkBind",
			data : {
				openId : openId ,
				phone : phone
			},
			type : "post",
			DataType : "json",
			success : function(data) {
				if(data){
					mui.alert("该手机号已绑定过微信,请解绑后登录","温馨提示","知道了");
					mui($("#login")).button('reset');
				}else{
					dologin(phone,code,recommand,uuid) ;
				}
			},
			error : function(){
				mui($("#login")).button('reset');
				mui.toast("网络不给力,请重试");
			}
		})
	}

	/**
	 * 登录
	 * @returns
	 */
	function dologin(phone,code,recommand,uuid) {
		mui.app_request('POST', {
			"OPERATE_TYPE" : "10002",
			"MOBILE" : phone,
			"SMS_CODE" : code,
			"RECOMMAND_USER" : recommand,
			"UUID" : uuid
		}, function(data) {
			mui($("#login")).button('reset');
			if (data.RESULTCODE == "0") {
				
				localStorage.setItem("istrue", false);
				localStorage.islogin = true;
				$("#gl").html($("#phone").val())
				$("#my-wc-modal").show();
				var userId = data.RESULTLIST.USER_ID;
				saveWeChatUser(userId);
			}
			return;
		}, function(data) {
			mui($("#login")).button('reset');
			if (data.RESULTCODE == "-1") {
				mui.toast(data.DESCRIPTION);
			} else {
				mui.toast("当前网络不给力");
			}
			remDisabled("login");
		}, true);
	}

	$("#my-wc-modal-btn").click(function() {
		window.location.href = "../index/index.html";
	})

	$("#fromHerf").click(function() {
		window.location.href = "login_agree.html";
	})

	function saveWeChatUser(userId) {
		$.ajax({
			url : wechat.baseUrl + "/user/saveUserId",
			data : {
				openId : openId,
				userId : userId
			},
			type : "get",
			DataType : "json",
			success : function(data) {
			}
		})
	}
	;

	function codeTime() {
		$("#getCode").html("倒计时(" + time + ")")
		time--;
		if (time == 0) {
			$("#getCode").html("获取验证码");
			clearTimeout(timer);
			$(this).removeAttr("disabled");
			time = 59;
		}
		if (time > 0) {
			timer = setTimeout(function() {
				codeTime();
			}, 1000);
		}
	}
})