
    // 需要认证用户身份的请求调用接口
      mui.app_request = function (reqType, params, onSuccess, onError, async) {
        if (!async) {
            async = false;
        }
        var onSuccess = arguments[2] ? arguments[2] : function () {
        };
        var onError = arguments[3] ? arguments[3] : function () {
        };

        var app_type = 'weixin';
//        if (mui.os.ios) {
//            app_type = 'ios'
//        } else {
//            app_type = "android"
//        }

        //console.log("app_type:"+app_type)
        var timestamp = Date.parse(new Date());
        //console.log("时间戳："+timestamp)
        var interface_version = '2.0';
        var opreate_type = params.OPERATE_TYPE;
        //console.log("OPERATE_TYPE:" + typeof opreate_type)
        var sign = interface_version + app_type + timestamp + opreate_type;
        sign = Encrypt(sign);
        //console.log("sign: "+sign.toString())
        params.sign = sign.toString();
        params.timestamp = timestamp;
        params.app_type = app_type;
        params.interface_version = interface_version;
        console.log("params:" + JSON.stringify(params))
        $.ajax({
            url:booking.constants.api_domain,
            data: params,
            timeout: 60000,
            dataType: 'json', //服务器返回json格式数据
            type: reqType, //HTTP请求类型
            async: async,
            success: function (data) {
                //获得服务器响应
                if (data.RESULTCODE == "0") {
                    onSuccess(data);
                } else {
                    onError(data);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                mui.toast("当前网络不给力，请稍后再试");
            }
        });
    };
    //校验非空,true为空；false不空
    mui.isnull = function (data) {
        if (typeof(data) == 'string') {
            data = data.trim();
        }
        return data == null || data == 'null' || data == "" || typeof(data) == "undefined" || data.length == 0 ? true : false;
    };




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
        //		//请求数据的url


        ip: 'http://106.14.45.207:9988',
        api_domain: 'http://106.14.45.207:9988/bz/outinterface/doBusiness',
        api_ip: 'http://106.14.45.207:9988',

//		ip: 'http://api.gs-xt.com',//192.168.1.118
//		api_domain: 'http://api.gs-xt.com/bz/outinterface/doBusiness',
//		api_ip: 'http://gs-xt.com',106.14.45.207:9988


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
    validate_mobile: function (mobile) {
        var mobilePattern = /^(((13[0-9])|(14[0-9])|(15[0-9])|(17[0-9])|(18[0-9]))+\d{8})$/; //手机校验规则
        if (!mobilePattern.test(mobile)) {
            return false;
        }
        return true;
    },

    /**
     * 验证密码是否符合格式要求
     * @param {Object} password
     */
    validate_password: function (password) {
        var passwordPattern = /^[0-9A-Za-z]{6,16}$/; //登录密码校验规则
        if (!passwordPattern.test(password)) {
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
        getFormatDate: function (curDate, pattern) {
            if (mui.isnull(curDate)) {
                curDate = new Date();
            }
            if (mui.isnull(pattern)) {
                pattern = "yyyy-MM-dd";
            }
            return curDate.format(pattern);
        },
        /**
         * 将long 值转换为对应的日期格式值
         * @param {Object} longdate
         * @param {Object} pattern
         */
        getFormatDataByLong: function (longdate, pattern) {
            if (mui.isnull(longdate)) {
                return;
            }
            if (mui.isnull(pattern)) {
                pattern = "yyyy-MM-dd";
            }
            return booking.dateUtil.getFormatDate(new Date(longdate), pattern);
        }
    },

}

/**
 * 短信倒计时 60s
 * @param {Object} o  点击获取验证码对象
 */
booking.time = 60;
booking.smsTime = function (o) {
    if (booking.time == 0) {
        o.removeAttribute("disabled");
        o.innerHTML = "发送验证码";
        booking.time = 60;
    } else {
        o.setAttribute("disabled", true);
        o.innerHTML = "倒计时(" + booking.time + ")";
        booking.time--;
        setTimeout(function () {
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
booking.smsTime_new = function (o) {
    if (booking.time_new == 0) {
        o.removeAttribute("disabled");
        o.innerHTML = "发送验证码";
        booking.time_new = 60;
    } else {
        o.setAttribute("disabled", true);
        o.innerHTML = "倒计时(" + booking.time_new + ")";
        booking.time_new--;
        setTimeout(function () {
                booking.smsTime_new(o);
            },
            1000)
    }
}


booking.closeAndOpenNewWindow = function (pagePath, pageId) {

    mui.openWindow({
        url: pagePath,
        id: pageId,

    });
};

booking.closeAndOpenNewWindowHaveAttr = function (pagePath, pageId, attr) {

    mui.openWindow({
        url: pagePath,
        id: pageId
    });
};

//控制按钮点击事件
function setDisabled(id) {
    document.getElementById(id).setAttribute('disabled', true);
};

function remDisabled(id) {
    document.getElementById(id).removeAttribute('disabled', false);
};
//截取手机号
function replacePhone(phone) {
    var num_one = phone.substr(0, 3);
    var num_two = phone.substr(7, 11);
    phone = num_one + "****" + num_two;
    return phone;
}

function Encrypt(word) {
    var key = CryptoJS.enc.Latin1.parse('whdiewjdo32e9232');
    var iv = CryptoJS.enc.Latin1.parse('rh3diwjdiwjdidji');
    return CryptoJS.AES.encrypt(word, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
    })
};

function Decrypt(word) {
    return CryptoJS.AES.decrypt(word, pwd).toString(CryptoJS.enc.Utf8);
}


function returnFloat(value) {
    var value = Math.round(parseFloat(value) * 100) / 100;
    var xsd = value.toString().split(".");
    if (xsd.length == 1) {
        value = value.toString() + ".00";
        return value;
    }
    if (xsd.length > 1) {
        if (xsd[1].length < 2) {
            value = value.toString() + "0";
        }
        return value;
    }
}function randomString(len) {
        len = len || 32;
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /** **默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1*** */
        var maxPos = $chars.length;
        var pwd = '';
        for (i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }