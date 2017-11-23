var auid =  localStorage.getItem("auid");
$(function() {

    if(!PwdBox.inited) {
        PwdBox.init('', '../../img/pwd_keyboard.png', '请输入支付密码', '安全支付环境，请放心使用！');
        $(".notice").html("<p>安全支付环境，请放心使用！</p><a id='forget' class='forget'>忘记密码?</a>")
    }
    document.getElementById("forget").addEventListener('tap', function() {
        booking.closeAndOpenNewWindow("find_pwd.html", "find_pwd")
    });

    document.getElementById("commit").addEventListener('tap', function() {
        setDisabled("commit");
        bus_append_fund()
    });

    mui.app_request('POST', {
        "OPERATE_TYPE": "10061",
        "AUTH_ID": auid,
    }, function(data) {
        if(data.RESULTCODE == "0") {
            $("#fund").attr("placeholder","可提现金额"+data.RESULTLIST.total_amount+"元")
        }
        return;
    }, function(result) {
        if(result.RESULTCODE == "-1") {
            mui.toast(result.DESCRIPTION);
        } else {
            mui.toast("当前网络不给力");
        }
        return;
    });


    //查询商铺是否绑定银行卡
    mui.app_request("Post", {
        "OPERATE_TYPE": "10078",
        "AUTH_ID": auid, //localStorage.getItem("auid")
    }, function(data) {
        console.log(JSON.stringify(data))
        if(data.RESULTCODE == "0"){
            var info = data.RESULTLIST.agent_info;
            $("#pay_getnum").html(info.bank_account_name);
            var card = info.bank_account_num;
            card = card.substr(card.length-4,card.length)
            card = '****  ****  ****  ' + card;

            console.log("s:"+card)
            $("#id_card").html(card);
            $("#open_bank").html(info.open_bank_name);
        }
    }, function(result) {
        if(result.RESULTCODE == "-1") {

            mui.toast(result.DESCRIPTION);
        } else {

            mui.toast("当前网络不给力");
        }
    });

    function bus_append_fund() {

        document.getElementById("fund").blur();
        var fund = parseInt(document.getElementById("fund").value);
        if(mui.isnull(fund)) {
            mui.toast("提现金额不能为空");
            remDisabled("commit");
            return;
        }
        if(fund < 100 || fund % 100 != 0) {
            mui.toast("提现金额最低为100元，且必须是100的倍数。");
            remDisabled("commit");
            return;
        }
        withdrawals(fund)
    }
});
function withdrawals(fund){
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
                            mui.app_request("Post", {
                                "OPERATE_TYPE": "10062",
                                "AUTH_ID": auid, //localStorage.getItem("auid")
                                "AMOUNT": fund,
                            }, function(data) {

                                if(data.RESULTCODE == "0") {
                                    //关闭并重置密码输入
                                    //$("#pay_password").hide();
                                    setTimeout(function() {
                                        PwdBox.reset();
                                        mui.toast("申请成功，系统会尽快处理！");
                                        remDisabled("commit"); //恢复按钮为非禁用
                                        booking.closeAndOpenNewWindow(
                                            'mine.html',
                                            'mine'
                                        );

                                    }, 500);
                                    return;
                                }
                                return;
                            }, function(result) {

                                if(result.RESULTCODE == "-1") {
                                    PwdBox.reset();
                                    remDisabled("commit");
                                    mui.toast(result.DESCRIPTION);

                                } else {
                                    PwdBox.reset();
                                    remDisabled("commit");
                                    mui.toast("当前网络不给力！");

                                }
                                //remDisabled("btn_submit");
                            });

                        } else {
                            mui.toast("密码错误！");
                            PwdBox.reset();
                            withdrawals(fund)

                        }
                    }
                }, function(result) {
                    console.log(JSON.stringify(result))
                    mui.toast(result.DESCRIPTION);
                });
            },500)
        } else {
            PwdBox.reset();
            remDisabled("commit");
            //alert(JSON.stringify(arguments));
        }
    }, remDisabled("commit"))
}