var auid = null;
var userType = null;
var turnover = null;
$(function() {
    if(!PwdBox.inited) {
        PwdBox.init('', '../../img/pwd_keyboard.png', '请输入支付密码', '安全支付环境，请放心使用！');
        $(".notice").html("<p>安全支付环境，请放心使用！</p><a id='forget' class='forget'>忘记密码?</a>")
    }
    document.getElementById("forget").addEventListener('tap', function() {
        booking.closeAndOpenNewWindow("set_paypassword.html", "set_paypassword")
    })
    auid = localStorage.getItem("auid");


    mui.app_request('POST', {
        "OPERATE_TYPE": "10023",
        "AUTH_ID": auid //localStorage.getItem("auid")
    }, function(data) {
        console.log(JSON.stringify(data))
        if(data.RESULTCODE == "0") {
            userType = data.RESULTLIST.user_type;
            var my_shop_info = data.RESULTLIST.my_shop_info;
            var my_base_info = data.RESULTLIST.my_base_info;
            if(!mui.isnull(my_shop_info.account_balance)) {
                account_balance = (my_shop_info.account_balance).toFixed(2)
                turnover = (my_shop_info.turnover).toFixed(2)
                //$("#banlance").html((my_shop_info.account_balance).toFixed(2));
            }
            $("#fund").attr("placeholder","可提现金额"+turnover+"元")
        }
        return;
    }, function(result) {
        return;
    });

    document.getElementById("detail").addEventListener('tap', function() {
        booking.closeAndOpenNewWindow("withdrawls_exp.html", "withdrawls_exp")
    });
    //查询商铺是否绑定银行卡
    mui.app_request("Post", {
        "OPERATE_TYPE": "10056",
        "AUTH_ID": auid, //localStorage.getItem("auid")
    }, function(result) {
        if(result.is_bind == 1) {
            $("#pay_getnum").html(result.shop_bank_account_info.account_name);
            var card = result.shop_bank_account_info.account_num;
            card = card.substr(card.length-4,card.length)
            card = '****  ****  ****  ' + card;
            $("#id_card").html(card);
            $("#open_bank").html(result.shop_bank_account_info.open_bank_name);
        } else {

        }

        return;
    }, function(result) {
        if(result.RESULTCODE == "-1") {

            mui.toast(result.DESCRIPTION);
        } else {

            mui.toast("当前网络不给力");
        }
    });

    document.getElementById("commit").addEventListener('tap', function() {

        this.setAttribute('disabled', 'disabled')
        bus_append_fund()
    })
    //				document.getElementById("detail").addEventListener('tap', function() {
    //					mui.openWindow({
    //						id: 'bus_withdetail',
    //						url: '../business/bus_withdetail.html'
    //					});
    //				});

    function bus_append_fund() {
        document.getElementById("fund").blur();
        var fund = parseInt(document.getElementById("fund").value);
        var funds = document.getElementById("fund").value;
        if(mui.isnull(funds)) {
            mui.toast("提现金额不能为空");
            document.getElementById("commit").removeAttribute('disabled'); //恢复按钮为非禁用
            return;
        }

//					if(fund % 100 != 0) {
//						mui.toast("提现金额需≥100，且为100的整数倍。");
//						document.getElementById("commit").removeAttribute('disabled'); //恢复按钮为非禁用
//						return;
//					}
        withdrawals(fund)
    }
})
function withdrawals(fund){
    PwdBox.show(function(res) {
        //console.log(JSON.stringify(res))
        if(res.status) {
            //重置输入
            var pay_pwd = res.password;
            setTimeout(function(){

                mui.app_request('POST', {
                    "OPERATE_TYPE": "10082",
                    "AUTH_ID": auid, //localStorage.getItem("auid"),
                    "PAY_PWD": pay_pwd,
                }, function(data) {
                    console.log("000:" + JSON.stringify(data))
                    if(data.RESULTCODE == "0") {
                        if(data.RESULTLIST.is_ok == 1) {
                            mui.app_request('POST', {
                                "OPERATE_TYPE": "10089",
                                "AUTH_ID": auid,
                                "AMOUNT": fund,
                                "CASH_TYPE": 1
                                //"PAY_PWD": pay_pwd,
                            }, function(data) {

                                if(data.RESULTCODE == "0") {
                                    //关闭并重置密码输入
                                    //$("#pay_password").hide();
                                    setTimeout(function() {
                                        PwdBox.reset();
                                        mui.toast("申请成功，系统会尽快处理！");
                                        document.getElementById("commit").removeAttribute('disabled'); //恢复按钮为非禁用
                                        booking.closeAndOpenNewWindow("mine.html", "mine")
                                    }, 500)
                                    return;
                                }
                                return;
                            }, function(result) {

                                if(result.RESULTCODE == "-1") {
                                    PwdBox.reset();
                                    document.getElementById("commit").removeAttribute('disabled'); //恢复按钮为非禁用
                                    mui.toast(result.DESCRIPTION);
                                    return;
                                } else {
                                    PwdBox.reset();
                                    document.getElementById("commit").removeAttribute('disabled'); //恢复按钮为非禁用
                                    mui.toast("当前网络不给力！");
                                    return;
                                }
                                //remDisabled("btn_submit");
                            });
                        } else {
                            mui.toast("密码错误！");
                            PwdBox.reset();
                            withdrawals(fund)
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
            //alert(JSON.stringify(arguments));
        }
    }, remDisabled("commit"))
}