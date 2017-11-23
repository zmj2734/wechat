var my_base_info = null;
var cash_info = null;
var nickName = "";
var pwd_word = "";
var head_image = "";
var domain_url = booking.constants.domain;
var auid = localStorage.getItem("auid");
var is_apply_state = null;

var bind_pay = null;
var ida_auth = null;
$(function() {
    //base_info
    mui.app_request('POST', {
        "OPERATE_TYPE": "20022",
        "AUTH_ID": auid
    }, function(data) {
        if(data.RESULTCODE == "0") {
            my_base_info = data.RESULTLIST.my_base_info;
            ida_auth = data.RESULTLIST.ida_auth;
            nickName = my_base_info.nickname;
            pwd_word = my_base_info.pay_pwd;
            head_image = my_base_info.header_img;
            if(!mui.isnull(my_base_info.header_img)) {
                $("#head_img").attr("src", booking.constants.ip + head_image);
            }
            if(!mui.isnull(my_base_info.nickname)) {
                $("#nickname").html(my_base_info.nickname);
            }
            if(ida_auth == "0") {
                is_apply_state = 0;
            }
            if(ida_auth == "1") {
                is_apply_state = 1;
            }
            if(ida_auth != 1) {
                $("#noRe").show();
            } else {
                $("#yesRe").show();

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
        "OPERATE_TYPE": "20028",
        "AUTH_ID": auid
    }, function(data) {
        if(data.RESULTCODE == "0") {
            cash_info = data.RESULTLIST.cash_info;
            bind_pay = cash_info.is_binding_alipay;
            if(cash_info.is_binding_alipay == "0") {
                $("#alipay").html("未绑定").removeClass("f00");

            } else {
                $("#alipay").html("已绑定").addClass("f00");

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




    document.getElementById("heads_img").addEventListener('tap', function() {
        var attrb = {
            "head_imgurl": head_image,
            "backId": "account_ment"
        };
        localStorage.setItem("my_headimg_attr",JSON.stringify(attrb));
        booking.closeAndOpenNewWindow("my_headimg.html", "my_headimg");
    });

    document.getElementById("exit").addEventListener('tap', function() {
        var btnArray = ['是', '否'];
        mui.confirm('确认退出登录吗?', '', btnArray, function(e) {
            if(e.index == 0) {
				localStorage.clear();
				plus.storage.clear();
                localStorage.removeItem("auid");
                booking.closeAndOpenNewWindow(
                    '../login/login.html',
                    'login'
                );
            } else {
                return;
            }
        });
    });

    document.getElementById("back").addEventListener("tap", function() {
        booking.closeAndOpenNewWindow("mine.html", "mine")
    })

    document.getElementById("r_gotoname").addEventListener('tap', function() {
        console.log(ida_auth)
        if(ida_auth == "-1" || ida_auth == "-2") {
            booking.closeAndOpenNewWindow("realname.html", "realname");
        } else if(ida_auth == "0") {
            mui.toast("实名审核中");
            return;
        } else if(ida_auth == "1") {
            mui.openWindow({
                id: 'realnamed',
                url: 'realnamed.html'
            });
        }

    });
    document.getElementById("r_name").addEventListener('tap', function() {
        var attrb = {
            name: nickName,
            backId: "account_ment"
        }
        localStorage.setItem("set_name_attr",JSON.stringify(attrb));
        booking.closeAndOpenNewWindowHaveAttr("set_name.html", "set_name", attrb);
    });
    document.getElementById("bdpay").addEventListener('tap', function() {
        if(is_apply_state == 0) {
            mui.toast("实名审核中...");
            return
        } else if(is_apply_state == 1) {
            if(bind_pay == 0) {
                booking.closeAndOpenNewWindow("bindAlipay.html", "bindAlipay");
            } else if(bind_pay == 1) {
                booking.closeAndOpenNewWindow("bindpay.html", "bindpay");
            }
        } else {

            var btnArray = ['去实名', '取消'];
            mui.confirm('只有实名用户可以绑定支付宝', '', btnArray, function(e) {
                if(e.index == 0) {
                    booking.closeAndOpenNewWindow("realname.html", "realname");
                } else {
                    return;
                }
            });

        }
    });
    document.getElementById("pay_pwd").addEventListener('tap', function() {

        if(is_apply_state == 0) {
            mui.toast("实名审核中...");
            return
        } else if(is_apply_state == 1) {

            if(bind_pay == 0) {
                mui.confirm('请先绑定支付宝', '', btnArray, function(e) {
                    if(e.index == 0) {
                        return;
                    } else {
                        booking.closeAndOpenNewWindow("bindAlipay.html", "bindAlipay");
                    }
                });
            } else if(bind_pay == 1) {
                if(mui.isnull(pwd_word)) {

                    booking.closeAndOpenNewWindow(
                        'set_paypassword.html',
                        'set_paypassword'
                    );
                } else {
                    booking.closeAndOpenNewWindow(
                        'update_pwd.html',
                        'update_pwd'
                    );
                }
            }

        } else {

            var btnArray = ['去实名', '取消'];
            mui.confirm('只有实名用户可以设置支付密码', '', btnArray, function(e) {
                if(e.index == 0) {
                    booking.closeAndOpenNewWindow("realname.html", "realname");
                } else {
                    return;
                }
            });

        }

    });
    document.getElementById("forgot_pwd").addEventListener('tap', function() {
        if(mui.isnull(pwd_word)) {
            mui.toast("请先设置支付密码");
            return;
        } else {

            booking.closeAndOpenNewWindow(
                'find_pwd.html',
                'find_pwd'
            );
        }
    });

})