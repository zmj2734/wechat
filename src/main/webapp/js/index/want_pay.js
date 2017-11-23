
var list = null;
var auid = localStorage.getItem("auid");
var pwd_word = null;
var level = null;
$(function() {
    if(!PwdBox.inited) {
        PwdBox.init('', '../../img/pwd_keyboard.png', '请输入支付密码', '安全支付环境，请放心使用！');
        $(".notice").html("<p>安全支付环境，请放心使用！</p><a id='forget' class='forget'>忘记密码?</a>")
    }
    document.getElementById("forget").addEventListener('tap', function() {
        booking.closeAndOpenNewWindow("../me/find_pwd.html", "find_pwd")
    });

    list = JSON.parse(localStorage.getItem("want_pay_attr"));

    mui.app_request('POST', {
        "OPERATE_TYPE": "10023",
        "AUTH_ID": auid
    }, function(data) {
        if(data.RESULTCODE == "0") {
            pwd_word = data.RESULTLIST.my_base_info.pay_pwd;
            level = data.RESULTLIST.userMember.level;
            if(level==0){
                $("#level").hide();
            }else{
                $("#level").show();
            }
        }
    }, function(result) {

    });



    $("#pay_total_money").html(list.pay_amount);
    $("#pay_list").on("tap", ".pay_pos", function() {
        $(".setimg").removeClass('change_imgpic');
        $(this).find(".setimg").addClass('change_imgpic');
    })

    document.getElementById("close").addEventListener("tap", function() {
        $("#pay_password").hide();
    })

    document.getElementById("next").addEventListener("tap", function() {
        var name = $(".change_imgpic").attr("id");
        if(name == "banlance") {
            if(mui.isnull(pwd_word)) {
                mui.alert('您尚未设置支付密码，请前往“首页→我的→账号管理”设置支付密码。', '系统提示', function() {

                });

            } else {
                PwdBox.show(function(res) {

                    if(res.status) {
                        //重置输入
                        var pay_pwd = res.password;
                        mui.app_request('POST', {
                            "OPERATE_TYPE": "10021",
                            "AUTH_ID": auid, //localStorage.getItem("auid")
                            "ORDER_NUM": list.out_trade_no,
                            "PAY_PWD": pay_pwd,
                        }, function(data) {
                            if(data.RESULTCODE == "0") {
                                remDisabled("btn_submit");
                                setTimeout(function() {
                                    PwdBox.reset();
                                    mui.toast(data.DESCRIPTION);
                                    booking.closeAndOpenNewWindow(
                                        '../index/index.html',
                                        'index'
                                    )
                                }, 500);
                                return;
                            }
                            return;
                        }, function(result) {
                            if(result.RESULTCODE == "-1") {
                                mui.toast(result.DESCRIPTION);
                                return;
                            } else {
                                mui.toast("当前网络不给力。！");

                            }
                        });
                    } else {
                        PwdBox.reset();

                    }
                }, remDisabled("btn_submit"))
            }


        }  else if(name == "wechat") {

            mui.app_request('POST', {
                "OPERATE_TYPE": "10095",
                "AUTH_ID": auid,
                "ORDER_NUM": list.out_trade_no
            }, function(data) {
                    remDisabled("btn_submit");
                    setTimeout(function() {
                        pay('wxpay', data.RESULTLIST.wx_pay_info);
                    }, 500)

            }, function(result) {
                if(result.RESULTCODE === "-1") {
                    mui.toast(result.DESCRIPTION);

                } else {
                    mui.toast("当前网络不给力。！");
                }
            });
        }
    })

});

