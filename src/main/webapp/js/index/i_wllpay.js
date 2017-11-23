var win = null;
var result = null;
var auid = localStorage.getItem("auid");
$(function () {
    mui.alert('付款后资金将直接进入对方账户，无法退款。为保证安全，请核实对方身份后支付。', '安全提示', function () {
    });
    result = JSON.parse(localStorage.getItem("i_wllpay_attr")).result;
    alert(JSON.stringify(result));

    $("#user").html(result.shop_name);
    var _html = "";
    if (mui.isnull(result.shop_logo_url)) {
        $("#shop_img").attr("src", result.shop_logo_url);
    }
    document.getElementById("give_other").addEventListener('tap', function () {
        checkPaypwd()
    });
});

function checkPaypwd() {
    var shop_id = result.shop_id;
    var money = document.getElementById("fund").value;
    if (mui.isnull(money)) {
        mui.toast("请输入付款金额。");
        return;
    }
    money = parseFloat(money).toFixed(2);
    var instruction = $("#instruction").val();
    mui.app_request('POST', {
        "OPERATE_TYPE": "10051",
        "AUTH_ID": auid,
        "SHOP_ID": shop_id,
        "AMOUNT": money,
        "DES": instruction
    }, function (data) {
        var list = data.RESULTLIST.pay_info;
        localStorage.setItem("want_pay_attr", JSON.stringify(list));
        booking.closeAndOpenNewWindow(
            'want_pay.html',
            'want_pay'
        )

    }, function (result) {
        if (result.RESULTCODE == "-1") {
            mui.toast(result.DESCRIPTION);
        } else {
            mui.toast("当前网络不给力。");
        }

    })
};