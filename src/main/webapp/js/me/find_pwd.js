var auid = null;
var mobile = null;
var type = null;
var code = null;
var uuid = null;
var userType = null;
$(function() {
    PwdBox.init('', 'img/pwd_keyboard.png', '请输入6位支付密码', '安全支付环境，请放心使用！');
    $("h1.title").html("");

    $(".icon-guanbi").hide();
    auid = localStorage.getItem("auid");
    win = JSON.parse(localStorage.getItem("find_pwd_attr"));
    mui('.mui-popover-action').on('tap', '.pic_pos', function() {
        var info = document.getElementById('yzcard');

        var a = this.querySelector("a");
        var type = a.getAttribute("type");
        //关闭actionsheet
        mui('#picture').popover('toggle');
        info.value = a.innerHTML;
        $("#card").attr("state", type);
    })

    mui.app_request('POST', {
        "OPERATE_TYPE": "10023",
        "AUTH_ID": auid //localStorage.getItem("auid")
    }, function(data) {
        console.log(JSON.stringify(data));
        if(data.RESULTCODE == "0") {
            mobile = data.RESULTLIST.my_base_info.username;
            userName = data.RESULTLIST.my_base_info.username;
            var num_one = userName.substr(0, 3);
            var num_two = userName.substr(7, 11);
            userType = data.RESULTLIST.user_type;
            userName = num_one + "****" + num_two;
            $("#phone").html(userName)
            $("#text").html("请为账号" + userName).addClass("ccc");
            $("#tips").show();
            if(userType == 3) {
                $("#shpow").show();
            } else {
                $("#shpow").hide();
            }
        }
        return;
    }, function(result) {
        console.log(JSON.stringify(result));
        return;
    });
    document.getElementById("up_send").addEventListener("tap", function() {
        $("input").blur();
        var send = document.getElementById("up_send");
        booking.smsTime_new(send);
        //return false;
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
                $("#set_pwd").hide();
                $("#identity").show()
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

    document.getElementById("yzcard").addEventListener("tap", function() {

        var btnArray = null;
        if(userType == 3) {
            btnArray = [{
                title: "支付宝"
            }, {
                title: "银行卡"
            }];
        } else {
            btnArray = [{
                title: "支付宝"
            }];
        }

        mui.actionSheet({
            title: "选择验证渠道",
            cancel: "取消",
            buttons: btnArray
        }, function(e) {
            var index = e.index;

            switch(index) {
                case 0:
                    break;
                case 1:
                    $("#userResult").html("支付宝账号:")
                    $("#yzcard").val("支付宝");
                    $("#card").attr("placeholder", "请输入您的支付宝账号");
                    $("#card").attr("state", "1");
                    break;
                case 2:
                    $("#userResult").html("银行卡号:");
                    $("#yzcard").val("银行卡");
                    $("#card").attr("placeholder", "请输入您的银行卡号");
                    $("#card").attr("state", "0");
                    break;
            }

        });

    })

    document.getElementById("nexts").addEventListener("tap", function() {
        var name = $("#name").val();
        var idcard = $("#idcard").val();
        var numbe = $("#card").val();
        var state = $("#card").attr("state");
        if(mui.isnull(name)) {
            mui.toast("真实姓名不能为空。");
            return;
        }
        if(mui.isnull(idcard)) {
            mui.toast("身份证号不能为空。");
            return;
        }

        if(mui.isnull(state)) {
            mui.toast("请选择验证方式。");
            return;
        }
        if(mui.isnull(numbe)) {
            if(state == 0) {
                mui.toast("请输入银行卡号。");
                return;
            } else if(state == 1) {
                mui.toast("请输入支付宝账号。");
                return;
            }
        }
        mui.app_request('POST', {
            'OPERATE_TYPE': "20005",
            'AUTH_ID': auid,
            'REACLNAME': name,
            'IDCARD': idcard,
            'TYPE': state,
            'CARDNUM': numbe,
        }, function(data) {
            console.log(JSON.stringify(data))
            if(data.RESULTCODE != -1) {
                $("#phoneCode").hide();
                $("#identity").hide()
                $("#set_pwd").show();
                console.log("sssss")
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
                        //mui.toast(JSON.stringify(arguments));
                    }
                });

            }
        }, function(result) {
            if(result.RESULTCODE == -1) {
                mui.toast(result.DESCRIPTION);
                return;
            } else {
                mui.toast(result.DESCRIPTION);
                return;
            }
        });

    })
    document.getElementById("confirm").addEventListener("tap", function() {
        mui.app_back(win.backId, true);
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
            //PwdBox.reset();
            mui.app_request('POST', {
                'OPERATE_TYPE': "10017",
                'AUTH_ID': auid,
                'PAY_PWD': new_pwd
            }, function(data) {
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
                if(result.RESULTCODE == -1) {
                    mui.toast(result.DESCRIPTION)
                }
            });
        } else {
            //alert(JSON.stringify(arguments));
        }
    });
}