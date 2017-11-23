var auid = localStorage.getItem("auid");
var surl = null;
var list = null;
var have_num = 0;
var daysynum = null;
var serverId = null;
var INVOICE_URL = null;
$(function () {
    //获取计算当日剩余补贴金额
    mui.app_request('POST', {
        "OPERATE_TYPE": "20006",
        "AUTH_ID": auid
    }, function (data) {
        console.log(JSON.stringify(data))
        if (data.RESULTCODE == "0") {
            var daynum = data.RESULTLIST.result;
            if (mui.isnull(daynum)) {
                daynum = 0;
            }
            daysynum = 2000 - parseInt(daynum);
            $("#amonut_sy").html(daysynum.toFixed(2))
        }

    }, function (result) {
        mui.toast("当前网络不给力。");
    });

    //获得用户的凭证列表
    mui.app_request('POST', {
        "OPERATE_TYPE": "10025",
        "AUTH_ID": auid
    }, function (data) {

        list = data.RESULTLIST.result;
        if (list.length == 0) {
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
        //circle();


    }, function (result) {
        mui.toast("当前网络不给力。");
    });
    var images = {
        localId: [],
        serverId: []
    };

    //绑定拍照事件
    document.getElementById("fpImage").addEventListener("click", function () {
        wx.chooseImage({
            count: 1,
            success: function (res) {
                var localId = res.localIds[0];
                wx.uploadImage({
                    localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
                    isShowProgressTips: 1, // 默认为1，显示进度提示
                    success: function (res) {
                        serverId = res.serverId; // 返回图片的服务器端ID
                        $.ajax({
                            url: "http://wx.gs-xt.com/wechat/remote/dowloadWxImage",
                            data: {
                                INVOICE_URL: serverId
                            },
                            type: "post",
                            DataType: "json",
                            async: true,
                            success: function (data) {
                                alert(JSON.stringify(data));

                                INVOICE_URL = data.RESULTLIST.PATH;

                                //下一步
                                document.getElementById("next").addEventListener('tap', function () {
                                    setDisabled("next");
                                    //发票总金额
                                    var all_money = $("#amonut_sy").html();
                                    var TOTAL_AMOUNT = $("#fp_money").val();
                                    var ALL_COUNT = 0;
                                    if (mui.isnull(TOTAL_AMOUNT)) {
                                        mui.toast("请输入发票金额");
                                        remDisabled("next");
                                        return;
                                    }
                                    //报账金额
                                    var BZ_AMOUNT = $("#bz_money").val();
                                    if (mui.isnull(BZ_AMOUNT)) {
                                        mui.toast("请输入补贴金额");
                                        remDisabled("next");
                                        return;
                                    }
                                    if (BZ_AMOUNT % 100 != 0 || BZ_AMOUNT == 0) {
                                        mui.toast('补贴金额必须为100的倍数且不能为0');
                                        remDisabled("next");
                                        return;
                                    }
                                    if (parseInt(all_money) < parseInt(BZ_AMOUNT)) {
                                        mui.toast('超过当日可补贴金额！');
                                        remDisabled("next");
                                        return;
                                    }
                                    //判断是否为100的整数倍
                                    if ($("#has_banlance").parent('div').hasClass('mui-active')) {
                                        var BAN_ACOUNT = 0;
                                        TOTAL_AMOUNTS = parseInt(BZ_AMOUNT) + parseInt(BAN_ACOUNT);
                                        TOTAL_AMOUNTS = parseInt(TOTAL_AMOUNTS);
                                        if (ALL_COUNT > TOTAL_AMOUNTS) {
                                            mui.toast('补贴金额不能大于发票金额');
                                            remDisabled("next");
                                            return;
                                        }
                                        remDisabled("next");
                                    } else {
                                        ALL_COUNT = parseInt(BZ_AMOUNT);
                                        if (ALL_COUNT > TOTAL_AMOUNT) {
                                            mui.toast('补贴金额不能大于发票金额');
                                            remDisabled("next");
                                            return;
                                        }
                                        remDisabled("next");
                                    }
                                    //发票路径
                                    var time = false;
                                    if (mui.isnull(INVOICE_URL)) {
                                        mui.toast("请上传发票");
                                        remDisabled("next");
                                        return;
                                    }
                                    var VOUCHER_TYPE = 1;
                                    if (mui.isnull(VOUCHER_TYPE)) {
                                        mui.toast("请选择报账档次");
                                        remDisabled("next");
                                        return;
                                    }
                                    var USE_BALANCE = 0;
                                    //					if($("#balan").hasClass("mui-active")) {
                                    //						USE_BALANCE = 1
                                    //					}
                                    if ($("#handle").parent("div").hasClass("mui-active")) {
                                        if (have_num * 100 < BZ_AMOUNT) {
                                            mui.toast("您的消费券不足");
                                            remDisabled("next");
                                            return;
                                        }

                                        mui.app_request('POST', {
                                            "OPERATE_TYPE": "10027",
                                            "AUTH_ID": auid, //localStorage.getItem("auid")
                                            "TOTAL_AMOUNT": TOTAL_AMOUNT,
                                            "BZ_AMOUNT": BZ_AMOUNT,
                                            "INVOICE_URL": INVOICE_URL,
                                            "VOUCHER_TYPE": VOUCHER_TYPE,
                                            "USE_BALANCE": USE_BALANCE,
                                            "USE_VOUCHER": 1
                                        }, function (data) {
                                            remDisabled("next");
                                            mui.toast("操作成功");
                                            localStorage.setItem("my_accountss_status", 0);
                                            booking.closeAndOpenNewWindow("my_accountss.html", "my_accountss");

                                        }, function (result) {
                                            remDisabled("next");
                                            if (result.RESULTCODE === "-1") {
                                                mui.toast(result.DESCRIPTION);

                                            } else {
                                                mui.toast("当前网络不给力。");

                                            }

                                        });
                                    } else {
                                        remDisabled("next");

                                        var attrValue = {
                                            "TOTAL_AMOUNT": TOTAL_AMOUNT,
                                            "BZ_AMOUNT": BZ_AMOUNT,
                                            "INVOICE_ID": null,
                                            "INVOICE_URL": INVOICE_URL,
                                            "VOUCHER_TYPE": VOUCHER_TYPE,
                                            "USE_BALANCE": USE_BALANCE

                                        };
                                        localStorage.setItem("findpeople_attr", JSON.stringify(attrValue));
                                        booking.closeAndOpenNewWindow(
                                            'findpeople.html',
                                            'findpeople'
                                        )
                                    }
                                });
                            }
                        });

                    }
                });
                $("#fpImage").attr("src", localId);
                //alert('已选择 ' + res.localIds.length + ' 张图片');
            }
        });
    });
    //获得用户的未报账金额
    mui.app_request('POST', {
        "OPERATE_TYPE": "10026",
        "AUTH_ID": auid //localStorage.getItem("auid")
    }, function (data) {
        if (data.RESULTCODE == "0") {
            var amount = data.RESULTLIST.amount;
            document.getElementById("amonut").innerHTML = amount;
            TOTAL_AMOUNT = amount;
        }
        return;
    }, function (result) {
        mui.toast("当前网络不给力。");
    });


    document.getElementById('stipulate').addEventListener('tap', function () {
        localStorage.setItem("newIMG", document.getElementById("fpImage").src);
        mui.openWindow({
            id: 'stipulate',
            url: '../me/stipulate.html'
        });
    });
});


function circle() {
    var point = $(".change_bgimg");
    var num = parseInt(point.find("p").html());
    for (var i = 0; i < list.length; i++) {
        var des = list[i].des;
        des = parseInt(des.substring(0, 1));

        if (num == des) {
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

function uploadSucess(data) {
    var idorhandurl = booking.constants.ip + data.RESULTLIST.PATH;
    surl = data.RESULTLIST.PATH;
    document.getElementById("fpImage").src = idorhandurl;
}