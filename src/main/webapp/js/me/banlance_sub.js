var win = null;
var banlance = null;
var contentWebview = null;
var cash_info = null;
var auid = localStorage.getItem("auid");;
var ida_auth = null;
var operate_type = null;
var bind_pay;
var list_num = 0;
var my_base_info = null;
var type = 0;
var word = 0;
var size = 10;
var first = 0;
$(function() {


    //获取用户状态
    mui.app_request('POST', {
        "OPERATE_TYPE": "20027",
        "AUTH_ID": auid
    }, function(data) {
        if(data.RESULTCODE == "0") {
            type = data.RESULTLIST.user_type;

            if(type == 1) {
                word = 10042;
            } else {
                word = 10052;
            }
        }
        return;
    }, function(result) {
        if(result.RESULTCODE == "-1") {
            mui.toast(result.DESCRIPTION);
        } else {
            mui.toast("当前网络不给力。");
        }
    })


    if(type == 3) {
        //收益信息
        mui.app_request('POST', {
            "OPERATE_TYPE": "20025",
            "AUTH_ID": auid
        }, function(data) {
            if(data.RESULTCODE == "0") {
                my_shop_info = data.RESULTLIST.my_shop_info;
                if(!mui.isnull(my_shop_info.account_balance)) {
                    $("#banlance").html((my_shop_info.account_balance).toFixed(2));
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
    }else{
        //base_info
        mui.app_request('POST', {
            "OPERATE_TYPE": "20022",
            "AUTH_ID": auid
        }, function(data) {
            if(data.RESULTCODE == "0") {
                my_base_info = data.RESULTLIST.my_base_info;
                ida_auth = data.RESULTLIST.ida_auth;
                if(type == 1) {
                    if(!mui.isnull(my_base_info.account_balance)) {
                        $("#banlance").html((my_base_info.account_balance).toFixed(2));
                    }
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
    }


    //base_info
    mui.app_request('POST', {
        "OPERATE_TYPE": "20028",
        "AUTH_ID": auid
    }, function(data) {
        if(data.RESULTCODE == "0") {
            cash_info = data.RESULTLIST.cash_info;
            bind_pay = cash_info.is_binding_alipay;

        }
        return;
    }, function(result) {
        if(result.RESULTCODE == "-1") {
            mui.toast(result.DESCRIPTION);
        } else {
            mui.toast("当前网络不给力。");
        }
    }, true)

    document.getElementById("detail").addEventListener("tap", function() {
        if(ida_auth == 1) {
            if(bind_pay == "0") {
                plus.nativeUI.confirm("为保障您的账户安全，请绑定本人的支付宝账号。", function(e) {
                    if(e.index == 0) {

                    } else {
                        booking.closeAndOpenNewWindow("bindAlipay.html", "bindAlipay");

                    }

                }, "提示", ["取消", "去绑定"]);
                return;
            } else {
                var fromType = null;
                if(type == "1"){
                    fromType = "10024";
                }else{
                    fromType = "10088";
                }
                var attrd ={
                    "type":fromType,
                    "case_type":2
                };
                localStorage.setItem("withdrawals_attr",JSON.parse(attrd));
                booking.closeAndOpenNewWindow("withdrawals.html", "withdrawals");
            }

        } else if(ida_auth == 0) {
            mui.toast("实名审核中...")
            return;
        } else if(ida_auth == -2) {
            mui.confirm("为保障您账户安全，请先完成身份认证。", function(e) {
                if(e.index == 0) {
                    return;
                } else {
                    booking.closeAndOpenNewWindow("realname.html", "realname");
                    return;
                }

            }, "提示", ["取消", "去认证"]);
        }
    });

    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    if(isAndroid == true) {
        var height = document.body.clientHeight;
        $("#body_margin").css('margin-top', -80 + "px");
        $("#pullrefresh").css('height', height - 174 + "px");
        $("#pullrefresh").css('margin-top', 200 + "px");
    }
    if(isiOS == true) {
        var height = document.body.clientHeight;
        $("#pullrefresh").css('overflow', ' hidden');
        $("#pullrefresh").css('height', height - 144 + "px");
        $("#pullrefresh").css('margin-top', 190 + "px");
        $("#body_margin").css('margin-top', -70 + "px");
    }
    mui('.mui-slider').slider().setStopped(true);
    auid = localStorage.getItem("auid");
    var old_back = mui.back;
//  mui.back = function() {
//      var wobj = plus.webview.getWebviewById("index"); //注意 HBuilder 是   1.html 的 ID  你如果1.html 有ID   要替换掉HBuilder，
//      old_back()
//  }
    var item = $("#segmentedControl .a_click.mui-active").attr("con");
    var bz_state = $("#segmentedControl .a_click.mui-active").attr("value");
    var ul = $("#segmentedControl .a_click.mui-active");
    var page = $("#segmentedControl .a_click.mui-active").attr("page");
    createFragment(ul, page, bz_state, item, 10, true);

    $("#segmentedControl .a_click").click(function() {
        $(this).addClass("mui-active").siblings().removeClass("mui-active");
        var index = $(this).index();
        $(".mui-slider-group .length").eq(index).show().siblings().hide();
        var item = $(this).attr("con");
        var bz_state = $(this).attr("value");
        var ul = $(this);
        var page = 0;
        createFragment(ul, page, bz_state, item, 10, true);
    });

//				mui.app_request("Post",  {
//					"OPERATE_TYPE": word,
//					"AUTH_ID": auid, //localStorage.getItem("auid")
//					"BEGIN": page,
//					"TYPE": -1,
//					"SIZE": size
//				}, function(result) {
//					console.log("00:"+JSON.stringify(result))
//					if(result.RESULTCODE == 0) {
//						var money = result.RESULTLIST.countAmount;
//						if(mui.isnull(money)){
//							money = 0
//						}
//						$("#banlance_sub").html(parseInt(money).toFixed(2))
//					}
//					return;
//				}, function(result) {
//					mui.toast(result.DESCRIPTION);
//						return;
//				},true);

    //循环初始化所有下拉刷新，上拉加载。
    $.each($('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
        mui(pullRefreshEl).pullToRefresh({
            up: {
                container: '#pullrefresh',
                contentnomore: '没有更多数据了',
                callback: function() {
                    var self = this;
                    setTimeout(function() {
                        var ul = self.element.querySelector('.mui-table-view');
                        var item = ul.getAttribute("con");
                        var bz_state = $("#segmentedControl").find(".a_click.mui-active").attr("value");
                        var page = $("#segmentedControl").find(".a_click.mui-active").attr("page");
                        console.log("page:"+page)
                        var ul = $("#segmentedControl").find(".a_click.mui-active");
                        createFragment(ul, page, bz_state, item, 10, false)
                        //ul.appendChild(createFragment(item,5));
                        self.endPullUpToRefresh();
                    }, 1000);
                }
            }
        });
    });

    function createFragment(ul, page, bz_state, item, count, is) {
        var data;
        if(bz_state == "0") {
            data = {
                "OPERATE_TYPE": word,
                "AUTH_ID": auid, //localStorage.getItem("auid")
                "BEGIN": page,
                "TYPE": bz_state,
                "SIZE": size
            }
        } else {

            data = {
                "OPERATE_TYPE": word,
                "AUTH_ID": auid, //localStorage.getItem("auid")
                "BEGIN": page,
                "TYPE": bz_state,
                "SIZE": size
            }
        }
        mui.app_request("Post", data, function(result) {
            console.log(JSON.stringify(result))
            var data = result.RESULTLIST.result;
            var _html = '';
            console.log(first)
            if(first==0){
                $("#banlance_other").html(parseFloat(result.RESULTLIST.revenue).toFixed(2))
                $("#banlance_sub").html(parseFloat(result.RESULTLIST.expenditure).toFixed(2))
                first++;
            }
            for(var i = 0; i < data.length; i++) {
                _html += '<div class="withContent">';
                _html += '<div class="left_time">';
                _html += '<p><span class="sub_type" style="color:#666666;font-weight:400;">' + data[i].des + '</span></p>';
                _html += '<span><span class="get_time">' + data[i].create_time + '</span></span>';
                _html += '</div>';
                _html += '<div class="fr">';
                _html += '<p><span class="profit">' + (data[i].amount).toFixed(2) + '</span></p>';
                _html += '</div>';
                _html += '</div>'
            }
            if(ul == null) {

            } else {
                ul.attr("page", parseInt(page) + parseInt(count));
            }

            if(is == true) {
                $("." + item).html(_html)
            } else {
                $("." + item).append(_html)
            };
            return;
        }, function(result) {
            mui.toast(result.DESCRIPTION);
            return;
        })
    };


});

function dateUtil(a) {
    return a.substring(0, 10);
}
//})(mui);