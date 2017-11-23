var CERTIFICATE_ID = null;
var auid = localStorage.getItem("auid")
var name = '';
var phone = null;
$(function() {



    CERTIFICATE_ID = JSON.parse(localStorage.getItem("for_reimbur_attr")).CERTIFICATE_ID;
    mui.app_request('POST', {
        "OPERATE_TYPE": "10033",
        "AUTH_ID": auid,
        "CERTIFICATE_ID": CERTIFICATE_ID
    }, function(data) {

            var data = data.RESULTLIST.result;

            var amount = data.amount;

            var amount_num = 0;
            var result = (amount.toString()).indexOf(".");
            if(data.is_shop ===1){
                name = data.bz_user;
            }
            phone = data.bz_mobile;
            if(result !== -1) {
                //alert("含有小数点");
                var leng = amount.toString().split(".")[1].length;
                if(leng == 1) {
                    amount_num = amount + '0';
                } else if(leng > 2) {
                    amount_num = amount.toString().split(".")[0] + '.' + amount.toString().split(".")[1].substr(0, 2)
                } else {
                    amount_num = amount
                }
            } else {
                amount_num = amount + '.00'
            }
            $(".name_info").html(data.bz_user);
            $("#bz_mobile").html(data.bz_mobile)
            $(".bz_mobile").attr("href", "tel:" + data.bz_mobile)
            $(".time").html(data.create_time);
            $("#price-je").html(amount_num);
            $(".client").html(data.voucher_des);
            $(".size").html(data.bz_count);
            $("#price-sy").html(data.shop_proft);
            $(".need_num").html(data.need_voucher);
            $(".spend_num").html(data.my_voucher);

            $("#reimimg").attr("src", booking.constants.ip + data.invoice_url);

    }, function(result) {
        if(result.RESULTCODE == "-1") {
            mui.toast(result.DESCRIPTION);
        } else {
            mui.toast("当前网络不给力。");
        }
    });

    //不受理
    document.getElementById("no_agree").addEventListener('tap', function() {
        plus.nativeUI.confirm("是否拒绝用户"+ name + "(" + phone + ")" + "的补贴申请？", function(e) {
            if(e.index == 0) {
                return;
            } else {
                $("#refuse").show();
            }
        }, "提示", ["取消", "确定"]);
    });
    //不受理
    document.getElementById("refuse_yes").addEventListener('tap', function() {
        setDisabled("refuse_yes");

        var value = $("#textarea").val();
        if(mui.isnull(value)) {
            remDisabled("refuse_yes")
            mui.toast("理由不能为空！");
            return
        }
        if(value.length > 100) {
            remDisabled("refuse_yes")
            mui.toast("理由不能超过100个字！");
            return
        }
        //return false;
        mui.app_request('POST', {
            "OPERATE_TYPE": "10034",
            "AUTH_ID": auid, //localStorage.getItem("auid")
            "CERTIFICATE_ID": CERTIFICATE_ID,
            "DES": value,
        }, function(data) {

            remDisabled("refuse_yes")

                mui.toast(data.DESCRIPTION);
                var attrValue = {
                    status: 0,
                    backId: "index"
                };
                localStorage.setItem("my_account_attr",JSON.stringify(attrValue));
                booking.closeAndOpenNewWindow(
                    'my_account.html',
                    'my_account'
                )

        }, function(result) {
            remDisabled("refuse_yes")

            if(result.RESULTCODE == "-1") {
                mui.toast(result.DESCRIPTION);
                return;
            } else {
                mui.toast("当前网络不给力。");
                return;
            }
        });
    });
    document.getElementById("refuse_no").addEventListener('tap', function() {
        document.activeElement.blur();
        $("#refuse").hide();
    })
    //受理
    document.getElementById("yes_agree").addEventListener('tap', function() {
        plus.nativeUI.confirm("是否受理用户"+ name + "(" + phone + ")" + "的补贴申请？", function(e) {
            if(e.index == 0) {
                return;
            } else {
                setDisabled("yes_agree")
                mui.app_request('POST', {
                    "OPERATE_TYPE": "10035",
                    "AUTH_ID": auid, //localStorage.getItem("auid")
                    "CERTIFICATE_ID": CERTIFICATE_ID,
                }, function(data) {

                    remDisabled("yes_agree");

                        mui.toast(data.DESCRIPTION);
                        var attrValue = {
                            status: 0,
                            backId: "index"
                        };
                        localStorage.setItem("my_account_attr",JSON.stringify(attrValue));
                        booking.closeAndOpenNewWindow(
                            'my_account.html',
                            'my_account'
                        )

                }, function(result) {
                    remDisabled("yes_agree")

                    if(result.RESULTCODE == "-1") {
                        //mui.toast(result.DESCRIPTION);
                        if(result.DESCRIPTION=="可用的消费券不足！"){
                            plus.nativeUI.confirm(result.DESCRIPTION+"是否前去购买？", function(e) {
                                if(e.index === 0) {

                                } else {
                                    booking.closeAndOpenNewWindow("../business/buy_voucher.html", "buy_voucher");

                                }

                            }, "提示", ["取消", "立即前往"]);
                        }else{
                            mui.toast(result.DESCRIPTION);
                        }

                    } else {
                        mui.toast("当前网络不给力。");

                    }
                });
            }
        }, "提示", ["取消", "确定"]);
    });

    document.getElementById("buy_vou").addEventListener('tap', function() {
        mui.openWindow({
            id: 'buy_voucher',
            url: '../business/buy_voucher.html'
        });
    });

});