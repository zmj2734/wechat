
var auid = localStorage.getItem("auid");
var account_balance = null;
var wxChannel = null; // 微信支付
var aliChannel = null; // 支付宝支付
var channel = null;
var isLogin = null;
var pwd_word = null;
$(function() {
    if(!PwdBox.inited) {
        PwdBox.init('', '../../img/pwd_keyboard.png', '请输入支付密码', '安全支付环境，请放心使用！');
        $(".notice").html("<p>安全支付环境，请放心使用！</p><a id='forget' class='forget'>忘记密码?</a>")
    }
    document.getElementById("forget").addEventListener('tap', function() {
        booking.closeAndOpenNewWindow("../me/find_pwd.html", "find_pwd")
    });
        init();
        //获取我的余额
        mui.app_request('POST', {
            "OPERATE_TYPE": "10023",
            "AUTH_ID": auid, //localStorage.getItem("auid")
        }, function(data) {

            if(data.RESULTCODE == "0") {
                account_balance = data.RESULTLIST.my_shop_info.account_balance;
                pwd_word = data.RESULTLIST.my_base_info.pay_pwd;
            }
            return;
        }, function(result) {
            if(result.RESULTCODE == "-1") {
                mui.toast(result.DESCRIPTION);
            } else {
                mui.toast("当前网络不给力。！")
            }

        },true);
        mui('.mui-popover-action').on('tap', '.pic_pos', function() {
            var info = document.getElementById('banlance');

            var a = this.querySelector("a");

            //关闭actionsheet
            mui('#picture').popover('toggle');
            info.innerHTML = a.innerHTML;
        });
        document.getElementById("close").addEventListener("tap", function() {
            $("#pay_password").hide();
        })
        mui.app_request('POST', {
            "OPERATE_TYPE": "10014",
        }, function(data) {
            if(data.RESULTCODE == "0") {
                var result = data.RESULTLIST.result;
                var _html = "";
                for(var i = 0; i < result.length; i++) {
                    if(result[i].enable == 1) {
                        _html += '<div class="container" >';
                        _html += '<div class="fl">';
                        _html += '<img src="../../img/buy/tow.png" class="dicount" />';
                        _html += '<input type="hidden" class="voucher_type" value="' + result[i].b_type + '"/>'
                        _html += '<span class="simgple_price">&yen;<span class="price one">' + (result[i].price).toFixed(2) + '</span></span>';
                        _html += '</div>';
                        _html += '<div class="mui-numbox fl" data-numbox-min="0">';
                        _html += '<button class="mui-btn mui-btn-numbox-minus minus" type="button">-</button>';
                        _html += '<input class="mui-input-numbox number" type="number" value="0" onkeypress="return event.keyCode>=48&&event.keyCode<=57" />';
                        _html += '<button class="mui-btn mui-btn-numbox-plus plus" type="button">+</button>';
                        _html += '</div>';
                        _html += '<span class="s_font">¥<span class="c_font sum">0.00</span></span>';
                        _html += '</div>';
                    }

                }
                $("#tab1").html(_html);

                $(".mui-btn-numbox-minus").unbind("click").click(function() {
                    var t = $(this).parent().find('input[class*=number]');
                    var priceSpan = $(this).parent().parent().find(".price");
                    var price = parseInt(priceSpan.html());
                    t.val(parseInt(t.val()) - 1);
                    if(t.val() <= 0) {
                        t.val(0);
                    }
                    var num = parseInt(t.val());
                    var sum = $(this).parent().parent().find(".sum");
                    sum.html((price * num).toFixed(2));
                    getTotal();
                });
                // 数量加
                $(".plus").unbind('click').click(function() {
                    var t = $(this).parent().find('input[class*=number]');
                    var priceSpan = $(this).parent().parent().find(".price");
                    var price = parseInt(priceSpan.html());
                    t.val(parseInt(t.val()) + 1);
                    if(t.val() <= 1) {
                        t.val(1);
                    }
                    var num = parseInt(t.val());
                    var sum = $(this).parent().parent().find(".sum");
                    sum.html((price * num).toFixed(2));
                    getTotal();
                });

                $(".mui-input-numbox").on("blur", function() {
                    var val = $(this).val();
                    var reg = /^\d+$/;
                    var _div = $(this).parent().parent();
                    if(!reg.test(val)) {
                        $(this).val("0");
                        _div.find(".sum").html("0.00");
                        mui.toast("只能输入正整数。")

                        getTotal();
                        return;
                    } else if(parseInt(val) > 100) {
                        $(this).val("0");
                        _div.find(".sum").html("0.00");
                        mui.toast("最大购买数量100");
                        getTotal();
                        return;
                    }
                    var price = parseInt(_div.find(".price").html());
                    _div.find(".sum").html((parseInt(val) * price).toFixed(2));
                    getTotal();
                    return;
                })
            }
            return;
        }, function(result) {
            mui.toast("当前网络不给力。");
        });

        document.getElementById("shopping").addEventListener("tap", function() {

            setDisabled("shopping");

            var status = this.getAttribute("status");
            if(status == "fasle" || status == false) {
                remDisabled("shopping");
                return;
            }
            var counts = getVoucherCounts();
            var total = parseFloat(getTotal());
            if(total <= 0) {
                mui.toast("选择需要购买的消费券");
                remDisabled("shopping");
                return;
            }
            mui.app_request('POST', {
                "OPERATE_TYPE": "10015",
                "AUTH_ID": auid, //localStorage.getItem("auid")
                "ORDER_INFO": counts
            }, function(data) {

                if(data.RESULTCODE == "0") {
                    var pay_info = data.RESULTLIST.pay_info;
                    var type = document.getElementById("banlance").innerHTML;

                    if(type == "余额付款") {
                        if(mui.isnull(pwd_word)) {
                            mui.alert('您尚未设置支付密码，请前往“首页→我的→账号管理”设置支付密码。', '系统提示', function() {
                                return;
                            });
                            return;
                        } else {
                            if(pay_info.pay_amount > account_balance) {
                                mui.toast("您的余额不足。");
                                remDisabled("shopping");
                                return;
                            } else {
                                var order_num = pay_info.out_trade_no;
                                btn_submit(order_num);
                                remDisabled("shopping");
                                $("#pay_total_money").html($(".total").html());
                                //$("#pay_password").show();
                                return;
                            }
                        }

                    } else if(type == '微信付款') {
                    	$.ajax({ 
                    		url : wechat.baseUrl + "/pay/wxPay",
                    		data : {
                    			"AUTH_ID": auid,
                                "orderNum": pay_info.out_trade_no 
                    		},
                    		dataType:"json",
                    		success:function(data){
                    			alert(JSON.stringify(data)) ;
                    		},
                    		error:function(e){
                    			
                    		}
                    	})
                        /*mui.app_request('POST', {
                            "OPERATE_TYPE": "10095",
                            "AUTH_ID": auid,
                            "ORDER_NUM": pay_info.out_trade_no ,
                            "TRADE_TYPE": "jsapi"
                        }, function(data) {
                            if(data.RESULTCODE == "0") {
                                remDisabled("btn_submit");
                                setTimeout(function() {

                                    //pay('wxpay', data.RESULTLIST.wx_pay_info);
                                }, 500);

                            }
                            return;
                        }, function(result) {
                            remDisabled("shopping");
                            if(result.RESULTCODE == "-1") {
                                mui.toast(result.DESCRIPTION);

                            } else {
                                mui.toast("当前网络不给力。");
                            }
                        });
*/
                    }

                }

                return;
            }, function(result) {
                remDisabled("shopping");
                $("#requerd").attr("status", "true");
                if(result.RESULTCODE == "-1") {
                    mui.toast(result.DESCRIPTION);
                } else {
                    mui.toast("当前网络不给力。")
                }


            });

        })

})

//余额支付
function btn_submit(order_num) {

    PwdBox.show(function(res) {
        remDisabled("shopping");

        if(res.status) {

            //重置输入
            var pay_pwd = res.password;
            setTimeout(function() {

                mui.app_request('POST', {
                    "OPERATE_TYPE": "10021",
                    "AUTH_ID": auid, //localStorage.getItem("auid")
                    "ORDER_NUM": order_num,
                    "PAY_PWD": pay_pwd,
                }, function(data) {

                    if(data.RESULTCODE == "0") {
                        //关闭并重置密码输入
                        //$("#pay_password").hide();
                        setTimeout(function() {
                            PwdBox.reset();
                            mui.toast(data.DESCRIPTION);
                            mui.openWindow({
                                id: 'index',
                                url: '../index/index.html',
                            });
                        }, 500)
                        return;
                    }
                    return;
                }, function(result) {
                    if(result.RESULTCODE == "-1") {
                        PwdBox.reset();
                        btn_submit(order_num);
                        mui.toast("密码错误！");
                        return;
                    } else {
                        PwdBox.reset();
                        mui.toast("当前网络不给力。！");
                        return;
                    }
                    //remDisabled("btn_submit");
                });
            }, 500)
        } else {
            PwdBox.reset();
            //alert(JSON.stringify(arguments));
        }
    }, remDisabled("shopping"))
}

function getTotal() {
    var s = 0;

    $(".container").each(function() {
        s += parseInt($(this).find('input[class*=number]').val()) *
            parseFloat($(this).find(".one").html());
    });
    $(".total").html(s.toFixed(2));
    return s;
}

function getVoucherCounts() {
    var counts = "";
    $(".container").each(function() {
        var type = $(this).find(".voucher_type").val();
        var count = parseInt($(this).find('input[class*=number]').val());
        counts += type + "_" + count + ',';
    });
    counts = counts.substring(0, counts.length - 1);
    return counts;
}

function init() {
    var width = $(window).width();
    var height = $(window).height();
    $("body").css("height", height);
    $("body").css("width", width);
}

