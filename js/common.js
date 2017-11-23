(function($) {
	// 校验网络
	var network = true;
	mui.checkNetwork = function() {
		if(mui.os.plus) {
			mui.plusReady(function() {
				if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
					network = false;
				} else {
					network = true;
				}
				//监听网络状态变化事件
				document.addEventListener("netchange", onNetChange, false);
				//状态栏设置
				setstatus();
			});
		}
		return network;
	};

	function onNetChange() {
		var nt = plus.networkinfo.getCurrentType();
		if(nt == plus.networkinfo.CONNECTION_NONE) {
			network = false;
		} else {
			network = true;
		}
	};

	function setstatus() {
		if(plus.navigator.isFullscreen()) {
			plus.navigator.setFullscreen(false);
		}
	};

	

	// 需要传递json 数据 请求调用接口
	mui.app_json_request = function(basePath, func_url, reqType, params, onSuccess, onError) {
		if(mui.checkNetwork() == false) {
			mui.toast("当前网络不给力，请稍后再试");
			return;
		}
		var onSuccess = arguments[4] ? arguments[4] : function() {};
		var onError = arguments[5] ? arguments[5] : function() {};
		var func_url = basePath + func_url;
		$.ajax( {
            url:func_url,
			data: params,
			timeout: 60000,
			dataType: 'json', //服务器返回json格式数据
			type: reqType, //HTTP请求类型
			contentType: 'application/json;charset=utf-8', //设置请求头信息
			success: function(data) {
				//获得服务器响应
				if(data.success) {
					onSuccess(data);
				} else {
					if(data.code == -1) {
						mui.cacheUser.clearCachePages(true);
						mui.cacheUser.clear();
						mui.toast("认证失败，请重新登录！");
						mui.openWindow(mui.app_filePath("template/login/login.html"), "login");
						return;
					}
					onError(data);
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				if(network == false) {
					mui.toast("当前网络不给力，请稍后再试");
					return;
				}
				mui.toast("当前网络不给力，请稍后再试");
			}
		});
	}

	// 需要认证用户身份的请求调用接口
	mui.app_request = function(reqType, params, onSuccess, onError) {
		if(mui.checkNetwork() == false) {
			mui.toast("当前网络不给力，请稍后再试");
			return;
		}
		var onSuccess = arguments[2] ? arguments[2] : function() {};
		var onError = arguments[3] ? arguments[3] : function() {};

		jQuery.ajax({
			url:booking.constants.api_domain,
			data: params,
			timeout: 60000,
			dataType: 'json', //服务器返回json格式数据
			type: reqType, //HTTP请求类型
			async: false,
			success: function(data) {
				//获得服务器响应
				if(data.RESULTCODE == "0") {
					onSuccess(data);
				} else {
					onError(data);
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				if(network == false) {
					mui.toast("当前网络不给力，请稍后再试");
					return;
				}
				mui.toast("当前网络不给力，请稍后再试");
			}
		});
	}
	
	// 需要认证用户身份的请求调用接口
	mui.app_request_async = function(reqType, params, onSuccess, onError) {
		if(mui.checkNetwork() == false) {
			mui.toast("当前网络不给力，请稍后再试");
			return;
		}
		var onSuccess = arguments[2] ? arguments[2] : function() {};
		var onError = arguments[3] ? arguments[3] : function() {};

        jQuery.ajax(booking.constants.api_domain, {
			data: params,
			timeout: 60000,
			dataType: 'json', //服务器返回json格式数据
			type: reqType, //HTTP请求类型
			async: false,
			success: function(data) {
				//获得服务器响应
				if(data.RESULTCODE == "0") {
					onSuccess(data);
				} else {
					onError(data);
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				if(network == false) {
					mui.toast("当前网络不给力，请稍后再试");
					return;
				}
				mui.toast("当前网络不给力，请稍后再试");
			}
		});
	}
	
	
	
	//用户信息管理
	mui.cacheUser = {
		/**
		 * 清除用户缓存信息
		 */
		clear: function() {
			plus.storage.removeItem("auid");
		},
		get: function(key) {
			return plus.storage.getItem(key);
		},
		isLogin: function() {
			var auth_id = localStorage.getItem("auid");
			if(mui.isnull(auth_id)) {
				var btnArray = ['登录', '返回'];
				mui.confirm('您不是登录用户，请登录(注册)。', '', btnArray, function(e) {
					if(e.index == 0) {
						mui.openWindow(mui.app_filePath("template/login/login.html"), "login");
					} else {
						return;
					}
				});
			}
		},
		/**
		 * 清除当前页面以外的其他页面
		 */
		clearCachePages: function(holdPage) {
			// 清除所有缓存页面
			var cachepages = plus.webview.all();
			var curr = plus.webview.currentWebview();
			if(holdPage) {
				mui.each(cachepages, function(index, item) {
					// 不是当前页和首页的都可以删除
					if(item.getURL().indexOf('start.html') < 0) {
						plus.webview.close(item);
					}
				});
				return;
			}
			mui.each(cachepages, function(index, item) {
				// 不是当前页和首页的都可以删除
				if(item.getURL() != curr.getURL() && item.getURL().indexOf('start.html') < 0) {
					plus.webview.close(item);
				}
			});
		},

		uploadLocation: function() {
			// 调用10064上传定位信息
			plus.geolocation.getCurrentPosition(function(p) {
				//alert(p.address);
				//alert('Geolocation\nLatitude:' + p.coords.latitude + '\nLongitude:' + p.coords.longitude + '\nAltitude:' + p.coords.altitude);
				var adderess = p.address.country + p.address.province + p.address.city + p.address.district + p.address.street + p.address.streetNum;
				mui.app_request("Post", {
					"OPERATE_TYPE": "10064",
					"AUTH_ID": localStorage.getItem("auid"),
					"LONGITUDE": p.coords.longitude,
					"LATITUDE": p.coords.latitude,
					"ADDR": adderess,
					"DISTRICT_NAME": p.address.district
				}, function(result) {
					if(result.RESULTCODE == 0) {
						//	console.log("dingwei:"+result.RESULTLIST.user_location.city_name)
						var city_name = result.RESULTLIST.user_location.district_name;
						localStorage.setItem("city_name", city_name)
					}
				}, function(result) {

				});

			}, function(e) {

			});

			// 调用10064上传定位信息
		},

		uploadPushInfo: function() {
			// 调用10071接口上传推送账户信息
			var clientId = plus.push.getClientInfo().clientid;
			var clientToken = plus.push.getClientInfo().token;
			console.log("clientId:" + clientId);
			console.log("clientToken:" + clientToken);
			var os = null;
			if(mui.os.android) {
				os = "android";
			} else if(mui.os.ios) {
				os = "ios";
			}

			mui.app_request("Post", {
				"OPERATE_TYPE": "10071",
				"AUTH_ID": localStorage.getItem("auid"),
				"CLIENT_TYPE": os,
				"CLIENT_ID": clientId,
				"DEVICE_TOKEN": clientToken
			}, function(result) {
				if(result.RESULTCODE == 0) {
					console.log(JSON.stringify(result));
				}

			}, function(result) {

			});
		}
	}

	//校验非空,true为空；false不空
	mui.isnull = function(data) {
		if(typeof(data) == 'string') {
			data = data.trim();
		}
		return data == null || data == 'null' || data == "" || typeof(data) == "undefined" || data.length == 0 ? true : false;
	}

	//呼叫弹出框
	mui.dialService = function(hintMsg, mobile, format_mobile) {
		plus.nativeUI.confirm(hintMsg, function(e) {
				if(e.index == 1) {
					plus.device.dial(mobile, false);
				}
			},
			format_mobile, ["取消", "呼叫"]);
	}
	
	/**
	 * 打开新页面
	 * @param {Object} page_url页面路径
	 * @param {Object} pageid 页面id
	 */
	mui.openNewPage = function(page_url, pageid) {
		//判断token和密钥是否存在，不存在则转到登录页面。
		if(!mui.cacheUser.isLogin()) {
			mui.openWindow(mui.app_filePath("template/login/login.html"));
			return;
		}
		mui.openWindow(
			page_url,
			pageid, {
				waiting: {
					autoShow: true, //自动显示等待框，默认为true
					title: '正在加载...', //等待对话框上显示的提示内容
				}
			}
		);
	}

	/**
	 * 放回指定页面，并且刷新指定页面
	 * @param {Object} pageId 指定页面ID
	 * @param {Object} isRefresh  是否刷新  如：true=刷新；false=不刷新
	 */
	mui.app_back = function(pageId, isRefresh) {
		mui.init({
			beforeback: function() {
				if(!mui.isnull(pageId)) {
					var _page = plus.webview.getWebviewById(pageId);

					if(_page) {
						_page.reload(isRefresh);
					}
				}
				return true;
			}
		});
		mui.back();
	}

	/**
	 * 放回指定页面，并且刷新指定页面
	 * @param {Object} pageId 指定页面ID
	 */
	mui.app_refresh = function(pageId) {
		if(!mui.isnull(pageId)) {
			var _page = plus.webview.getWebviewById(pageId);
			if(_page) {
				_page.reload(true);
			}
		}
	}

	/**
	 * 获取文件所在环境具体位置 
	 * @param {Object} file_url 文件及文件所在位置    如：booking/login/login.html
	 */
	mui.app_filePath = function(file_url) {
		var path = plus.io.convertLocalFileSystemURL('_www/' + file_url);
		var filePath = plus.io.convertAbsoluteFileSystem(path);
		return filePath;
	}

})(mui);

//扩展Date的format方法
	Date.prototype.format = function (format) {
		var o = {
			"M+": this.getMonth() + 1,
			"d+": this.getDate(),
			"h+": this.getHours(),
			"m+": this.getMinutes(),
			"s+": this.getSeconds(),
			"q+": Math.floor((this.getMonth() + 3) / 3),
			"S": this.getMilliseconds()
		}
		if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		for (var k in o) {
		if (new RegExp("(" + k + ")").test(format)) {
		format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		}
		}
		return format;
	}
	
/**
 * 自定义工具类
 */
var first = null;
var booking = {
	// 系统常量
	constants: {

////		//请求数据的url
		ip: 'http://106.14.45.207:9988',
		api_domain: 'http://106.14.45.207:9988/bz/outinterface/doBusiness',
		api_ip:'http://106.14.45.207:9988',
// 		ip: 'http://api.gs-xt.com',
// 		api_domain: 'http://api.gs-xt.com/bz/outinterface/doBusiness',
// 		api_ip : 'http://gs-xt.com',

		//密钥
		user_secret: 'user_secret',
		//用户手机号
		user_mobile: 'user_mobile',
		reqPost: 'POST',
		reqGet: 'GET',
		sms_Timeout: 60,
	},
	/**
	 * 验证手机号是否符合格式要求 
	 * @param {Object} mobile
	 */
	validate_mobile: function(mobile) {
		var mobilePattern = /^(((13[0-9])|(14[0-9])|(15[0-9])|(17[0-9])|(18[0-9]))+\d{8})$/; //手机校验规则
		if(!mobilePattern.test(mobile)) {
			return false;
		}
		return true;
	},

	/**
	 * 验证密码是否符合格式要求
	 * @param {Object} password
	 */
	validate_password: function(password) {
		var passwordPattern = /^[0-9A-Za-z]{6,16}$/; //登录密码校验规则
		if(!passwordPattern.test(password)) {
			return false;
		}
		return true;
	},
	dateUtil: {
		/**
		 *转换日期对象为日期字符串
		 * @param l long值
		 * @param pattern 格式字符串,例如：yyyy-MM-dd hh:mm:ss
		 * @return 符合要求的日期字符串
		 */
		getFormatDate: function(curDate, pattern) {
			if(mui.isnull(curDate)) {
				curDate = new Date();
			}
			if(mui.isnull(pattern)) {
				pattern = "yyyy-MM-dd";
			}
			return curDate.format(pattern);
		},
		/**
		 * 将long 值转换为对应的日期格式值
		 * @param {Object} longdate
		 * @param {Object} pattern
		 */
		getFormatDataByLong: function(longdate, pattern) {
			if(mui.isnull(longdate)) {
				return;
			}
			if(mui.isnull(pattern)) {
				pattern = "yyyy-MM-dd";
			}
			return booking.dateUtil.getFormatDate(new Date(longdate ), pattern);
		}
	},

}

/**
 * 短信倒计时 60s
 * @param {Object} o  点击获取验证码对象
 */
booking.time = 60;
booking.smsTime = function(o) {
	if(booking.time == 0) {
		o.removeAttribute("disabled");
		o.innerHTML = "发送验证码";
		booking.time = 60;
	} else {
		o.setAttribute("disabled", true);
		o.innerHTML = "倒计时(" + booking.time + ")";
		booking.time--;
		setTimeout(function() {
				booking.smsTime(o);
			},
			1000)
	}
}

/**
 * 短信倒计时 60s
 * @param {Object} o  点击获取验证码对象
 */
booking.time_new = 60;
booking.smsTime_new = function(o) {
	if(booking.time_new == 0) {
		o.removeAttribute("disabled");
		o.innerHTML = "发送验证码";
		booking.time_new = 60;
	} else {
		o.setAttribute("disabled", true);
		o.innerHTML = "倒计时(" + booking.time_new + ")";
		booking.time_new--;
		setTimeout(function() {
				booking.smsTime_new(o);
			},
			1000)
	}
}

/**
 * 刷新初始化页面
 */
booking.refresh_init_page = function() {
	mui.app_refresh('index');
	mui.app_refresh('message');
	mui.app_refresh('merchant');
	mui.app_refresh('mine');
}

/**
 * 校验页面是否打开，打开就直接显示
 * @param {Object} path
 * @param {Object} id
 */
booking.showWindow = function(pagePath, pageId) {
	var _page = plus.webview.getWebviewById(pageId);
	if(_page) {
		plus.webview.open(pageId.id);
		return;
	}
	mui.openWindow(pagePath, pageId);
}

booking.closeAndOpenNewWindow = function(pagePath, pageId) {
	mui.openWindow({
		url: pagePath,
		id: pageId,
		createNew: true
	});
}

booking.closeAndOpenNewWindowHaveAttr = function(pagePath, pageId,attr) {
	mui.openWindow({
		url: pagePath,
		id: pageId,
		createNew: true,
		extras: attr
	});
}


//控制按钮点击事件
function setDisabled(id) {
	document.getElementById(id).setAttribute('disabled', true);
};

function remDisabled(id) {
	document.getElementById(id).removeAttribute('disabled', false);
};
//截取手机号
function replacePhone(phone){
	var num_one = phone.substr(0, 3);
	var num_two = phone.substr(7, 11);
	phone = num_one + "****" + num_two;
	return phone;
}




// 上传定位信息