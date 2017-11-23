var auid = localStorage.getItem("auid");
var have_num = 0;
var INVOICE_ID = null;
var win = null;
var list = null;
var CERTIFICATE_ID = null;
var re_submit = null;
var daysynum = null;
var isLogin = null;
$(function () {


    win = JSON.parse(localStorage.getItem("account_reimbur_me_attr"));
    CERTIFICATE_ID = win.CERTIFICATE_ID;
    re_submit = win.re_submit;
    INVOICE_ID = win.INVOICE_ID;

    //获得用户的凭证列表
    mui.app_request('POST', {
        "OPERATE_TYPE": "10025",
        "AUTH_ID": auid,
        "INVOICE_ID": INVOICE_ID
    }, function (data) {
        list = data.RESULTLIST.result;
        if (list.length === 0) {
            $("#no_use").html("你没有可使用的消费券");
            $("#kaiguan").hide();
        } else {
            for (var i = 0; i < list.length; i++) {
                var des = list[i].des;
                des = parseInt(des.substring(0, 1));
                if (8 == des) {
                    if (list[i].num > 0) {
                        $("#no_use").html("可使用消费券" + list[i].num + "张");
                        $("#kaiguan").show();
                        have_num = list[i].num;
                        break;
                    }
                } else {
                    $("#no_use").html("你没有可使用的消费券");
                    $("#kaiguan").hide();
                }
            }
        }


    }, function (result) {
        mui.toast("当前网络不给力。");
    });
    //获取计算当日剩余补贴金额
    mui.app_request('POST', {
        "OPERATE_TYPE": "20006",
        "AUTH_ID": auid
    }, function (data) {


        var daynum = data.RESULTLIST.result;
        if (mui.isnull(daynum)) {
            daynum = 0;
        }
        daysynum = 2000 - parseInt(daynum);
        $("#amonut_sy").html(daysynum.toFixed(2))

    }, function (result) {
        mui.toast("当前网络不给力。");
    });

    mui.app_request('POST', {
        "OPERATE_TYPE": "10065",
        "AUTH_ID": auid,
        "INVOICE_ID": INVOICE_ID
    }, function (data) {
        var reuslt = data.RESULTLIST.invoice;
        $("#fpImage").attr("src", booking.constants.ip + reuslt.file_url);
        var total = parseFloat(reuslt.amount) - parseFloat(reuslt.used_amount);
        $("#fp_money").val(total);
    }, function (result) {

        if (result.RESULTCODE == "-1") {
            mui.toast(result.DESCRIPTION);
            return;
        }
        mui.toast("当前网络不给力。");
        return;
    });


    //下一步
    document.getElementById("next").addEventListener('tap', function () {
        this.setAttribute('disabled', 'disabled');
        //报账金额
        var all_money = $("#amonut_sy").html();
        var BZ_AMOUNT = $("#bz_money").val();
        var TOTAL_AMOUNT = $("#fp_money").val();
        if (mui.isnull(BZ_AMOUNT)) {
            document.getElementById("next").removeAttribute('disabled');
            mui.toast("请输入补贴金额");
            return;
        }
        if (BZ_AMOUNT % 100 !== 0 || BZ_AMOUNT === 0) {
            mui.toast('补贴金额必须为100的倍数且不能为0');
            remDisabled("next");
            return;
        }
        if (parseInt(all_money) < parseInt(BZ_AMOUNT)) {
            mui.toast('超过当日可补贴金额！');
            remDisabled("next");
            return;
        }
        var VOUCHER_TYPE = 1;
        if (mui.isnull(VOUCHER_TYPE)) {
            document.getElementById("next").removeAttribute('disabled');
            mui.toast("请选择报账档次");
            return;
        }
        if ($("#has_banlance").parent('div').hasClass('mui-active')) {
            var BAN_ACOUNT = 0;
            TOTAL_AMOUNTS = parseInt(TOTAL_AMOUNT) + parseInt(BAN_ACOUNT);
            TOTAL_AMOUNTS = parseInt(TOTAL_AMOUNTS);

            if (BZ_AMOUNT > TOTAL_AMOUNTS) {
                mui.toast('补贴金额不能大于发票金额');
                remDisabled("next");
                return;
            }
            remDisabled("next");
        } else {
            BZ_AMOUNT = parseInt(BZ_AMOUNT);
            if (BZ_AMOUNT > TOTAL_AMOUNT) {
                mui.toast('补贴金额不能大于发票金额');
                remDisabled("next");
                return;
            }
            remDisabled("next");
        }
        var USE_BALANCE = 0;

        if ($("#handle").parent("div").hasClass("mui-active")) {
            if (re_submit == 1) {
                mui.app_request('POST', {
                    "OPERATE_TYPE": "10036",
                    "AUTH_ID": auid, //localStorage.getItem("auid")
                    "CERTIFICATE_ID": CERTIFICATE_ID,
                    "BZ_AMOUNT": BZ_AMOUNT,
                    "VOUCHER_TYPE": VOUCHER_TYPE,
                    "USE_BALANCE": USE_BALANCE,
                    "INVOICE_ID": INVOICE_ID,
                    "USE_VOUCHER": 1,
                }, function (data) {


                    document.getElementById("next").removeAttribute('disabled');
                    mui.toast("操作成功");
                    mui.openWindow("my_accountss.html", "my_accountss");


                }, function (result) {
                    document.getElementById("next").removeAttribute('disabled');
                    if (result.RESULTCODE === "-1") {
                        mui.toast(result.DESCRIPTION);

                    } else {
                        mui.toast("当前网络不给力。");

                    }
                });
            } else {
                if (have_num * 100 < BZ_AMOUNT) {
                    document.getElementById("next").removeAttribute('disabled');
                    mui.toast("您的消费券不足");
                    return;
                }
                mui.app_request('POST', {
                    "OPERATE_TYPE": "10027",
                    "AUTH_ID": auid, //localStorage.getItem("auid")
                    "BZ_AMOUNT": BZ_AMOUNT,
                    "VOUCHER_TYPE": VOUCHER_TYPE,
                    "USE_BALANCE": USE_BALANCE,
                    "INVOICE_ID": INVOICE_ID,
                    "USE_VOUCHER": 1,
                }, function (data) {
                    document.getElementById("next").removeAttribute('disabled');
                    mui.toast("操作成功");
                    mui.openWindow("my_accountss.html", "my_accountss");
                }, function (result) {
                    document.getElementById("next").removeAttribute('disabled');
                    if (result.RESULTCODE === "-1") {
                        mui.toast(result.DESCRIPTION);
                    } else {
                        mui.toast("当前网络不给力。");

                    }
                });
            }
        } else {
            if (re_submit === 1) {

                document.getElementById("next").removeAttribute('disabled');
                var attrValue = {
                    "CERTIFICATE_ID": CERTIFICATE_ID,
                    "re_submit": re_submit,
                    "BZ_AMOUNT": BZ_AMOUNT,
                    "INVOICE_ID": INVOICE_ID,
                    "VOUCHER_TYPE": VOUCHER_TYPE,
                    "USE_BALANCE": USE_BALANCE
                };
                localStorage.setItem("findpeople_attr", JSON.stringify(attrValue));
                booking.closeAndOpenNewWindow(
                    'findpeople.html',
                    'findpeople'
                )
            } else {
                document.getElementById("next").removeAttribute('disabled');
                var attrValue = {
                    "BZ_AMOUNT": BZ_AMOUNT,
                    "INVOICE_ID": INVOICE_ID,
                    "VOUCHER_TYPE": VOUCHER_TYPE,
                    "USE_BALANCE": USE_BALANCE
                };
                localStorage.setItem("findpeople_attr", JSON.stringify(attrValue));
                booking.closeAndOpenNewWindow(
                    'findpeople.html',
                    'findpeople'
                )
            }
        }

    });

});

