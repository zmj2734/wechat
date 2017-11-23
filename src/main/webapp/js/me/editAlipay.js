var uuid = null;
var auid = localStorage.getItem("auid");
var checId = false;
var win = null;
var mobile = null;
$(function() {

    win = JSON.parse(localStorage.getItem("editAlipay_attr"));
    document.getElementById("trueName").innerHTML = win.name;
    mui.app_request('POST', {
        "OPERATE_TYPE": "20022",
        "AUTH_ID": auid
    }, function(data) {
        if(data.RESULTCODE == "0") {
            mobile = data.RESULTLIST.my_base_info.username;
            $("#phoneTip").html('将向手机' + replacePhone(mobile) + '发送验证码')
        }

    }, function(result) {
        mui.toast("当前网络不给力");
    });

    document.getElementById("up_send").addEventListener("tap", function() {
        $("input").blur();
        var send = document.getElementById("up_send");
        booking.smsTime_new(send);
        mui.app_request('POST', {
            "OPERATE_TYPE": "10001",
            "MOBILE": mobile,
            "B_TYPE": "46"
        }, function(data) {
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

    //登录的点击事件
    document.getElementById("login").addEventListener('tap', function() {
        setDisabled("login");
        $("input").blur();
        var account = document.getElementById("payAccount").value;
        var code = document.getElementById("code").value;
        if(mui.isnull(account)) {
            mui.toast("请输入支付宝账号");
            remDisabled("login");
            return;
        }

        if(mui.isnull(code)) {
            mui.toast("验证码不能为空");
            remDisabled("login");
            return;
        }
        if(mui.isnull(uuid)) {
            mui.toast("请先发送验证码");
            remDisabled("login");
            return;
        }

        mui.app_request('POST', {
            "OPERATE_TYPE": "10084",
            "AUTH_ID": auid,
            "SMS_CODE": code,
            "NEW_ACCOUNT": account,
            "UUID": uuid
        }, function(data) {
            if(data.RESULTCODE == "0") {
                remDisabled("login");
                mui.toast("修改成功");
                uuid = null;
                booking.closeAndOpenNewWindow(
                    'mine.html',
                    'mine'
                )
            }

            remDisabled("login");
            return;
        }, function(data) {
            if(data.RESULTCODE == "-1") {
                mui.toast(data.DESCRIPTION);
            } else {
                mui.toast("当前网络不给力！");
            }
            remDisabled("login");
            return;
        });
    });

})