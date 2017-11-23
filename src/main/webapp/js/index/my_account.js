window.onload = function() {
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });
}


var auid = localStorage.getItem("auid");

$(function() {
    $('.mui-slider').slider().setStopped(true);
    var type = plus.webview.currentWebview().status;
    var tab = $("#segmentedControl a");
    for(var i = 0; i < tab.length; i++) {
        if(tab.eq(i).attr("value") == type) {
            tab.eq(i).siblings().removeClass("mui-active")
            tab.eq(i).addClass("mui-active");
            var item = tab.eq(i).attr("con");
            var bz_state = tab.eq(i).attr("value");
            var ul = tab.eq(i);
            var page = tab.eq(i).attr("page");
            createFragment(ul, page, bz_state, item, 5, true);
        }

    }
    var tabs = $('.mui-slider-group').find(".length");
    for(var i = 0; i < tabs.length; i++) {
        if(tabs.eq(i).attr("value") == type) {
            tabs.eq(i).siblings().hide();
            tabs.eq(i).show();

        }
    }
    $("#segmentedControl a").click(function() {
        $(this).addClass("mui-active").siblings().removeClass("mui-active");
        var index = $(this).index();
        $(".mui-slider-group .length").eq(index).show().siblings().hide();
        var item = $(this).attr("con");
        var bz_state = $(this).attr("value");
        var ul = $(this);
        var page = 0;
        createFragment(ul, page, bz_state, item, 5, true);
    });

    //循环初始化所有下拉刷新，上拉加载。
    $.each($('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
        mui(pullRefreshEl).pullToRefresh({
            up: {
                container: '#pullrefresh',
//							contentrefresh: '正在加载...',
                contentnomore: '没有更多数据了',
                callback: function() {
                    var self = this;
                    setTimeout(function() {
                        var ul = self.element.querySelector('.mui-table-view');
                        var item = ul.getAttribute("con");
                        var bz_state = $("#segmentedControl").find("a.mui-active").attr("value");
                        var page = $("#segmentedControl").find("a.mui-active").attr("page");
                        var ul = $("#segmentedControl").find("a.mui-active");
                        createFragment(ul, page, bz_state, item, 5, false)
                        self.endPullUpToRefresh();
                    }, 1000);
                }
            }
        });
    });

    function createFragment(ul, page, bz_state, item, count, is) {
        var OPERATE_TYPE=null;
        var datas = null;
        if(bz_state=="0"){
            OPERATE_TYPE = "20011"
        }else if(bz_state=="1"){
            OPERATE_TYPE = "20012"
        }else if(bz_state=="2"){
            OPERATE_TYPE = "20013"
        }
        //alert(OPERATE_TYPE)
        mui.app_request("Post", {
            "OPERATE_TYPE": OPERATE_TYPE,
            "AUTH_ID": auid, //localStorage.getItem("auid")
            "BEGIN": page,
            "SIZE": count,
        }, function(result) {
            console.log("00:"+JSON.stringify(result))
            //mui('#pullrefresh').pullRefresh().endPullupToRefresh((++page > result.RESULTLIST.totalsize));
            var data = null;
            if(bz_state=="0"){
                data = result.RESULTLIST;
            }else if(bz_state=="1"){
                data = result.RESULTLIST.result;
            }else if(bz_state=="2"){
                data = result.RESULTLIST.result;
            }
            var html = '';
            for(var i = 0; i < data.length; i++) {
                var sData = data[i];
                var voucher_type = '';
                var state = '';
                var certificate_num = sData.certificate_num;
                var time = sData.create_time;
                if(sData.voucher_type == 1) {
                    voucher_type = '20元档'
                } else if(sData.voucher_type == 2) {
                    voucher_type = '30元档'
                } else if(sData.voucher_type == 3) {
                    voucher_type = '40元档'
                } else if(sData.voucher_type == 4) {
                    voucher_type = '50元档'
                }

                var img_src = '';
                if(sData.state == 0) {
                    img_src = '../../img/acount/no_group.png'
                } else if(sData.state == 1) {
                    img_src = '../../img/acount/is_group.png'
                } else if(sData.state == 2) {
                    img_src = '../../img/acount/is_finish.png'
                } else if(sData.state == -1) {
                    img_src = '../../img/acount/no_go.pngpng'
                }
                var num = Math.ceil(sData.amount / 100);
                var already_amount = sData.already_amount;
                var not_bz_amount = sData.not_bz_amount;
                if(mui.isnull(already_amount)){
                    already_amount = 0;
                }
                if(mui.isnull(not_bz_amount)){
                    not_bz_amount = 0;
                }

                if(bz_state=="0") {
                    //需要我受理的待处理
                    html += '<div class="que_module" id="in_group">'
                    html += '<div class="que_title">'
                    html += '<p class="que_num fl">补贴编号：<span>' + sData.certificate_num + '</span></p>'
                    html += '<p class="que_size fr">' + voucher_type + '</p>'
                    html += '</div>'
                    html += '<div class="acount_detail">'
                    html += '<p class="bz_name">补贴详情</p>'
                    html += '<p class="bz_time fr">' + time + '</p>'
                    html += '<p class="bz_count">补贴总金额:<span class="red">' + (sData.amount).toFixed(2) + '</span><span class="red">元</span></p>'
                    html += '<p class="need_voucher">需使用消费券:<span class="red">' + num + '</span>&nbsp;张</p>'
                    html += '<p class="bz_people">申请人:<span class="red">' + sData.bz_user + '</span><span class="red"></span></p>'
                    html += '<p class="bz_people">申请账号:<a href="tel:' + sData.mobile + '"><span class="red">' + sData.mobile + '</span>&nbsp;&nbsp;点击拨打</a></p>'
                    html += '<p class="invoice invoice_info fr" onclick="invoice_info(' + sData.id + ')">处理申请</p>'
                    html += '<img src="../../img/acount/wait_chuli.png" class="queue_img" />'
                    html += '</div>'
                    html += '</div>'
                } else if(bz_state=="1") {
//                  if(sData.sc_type==3){
//                      html += '<div class="que_module">'
//                      html += '<div class="que_title">'
//                      html += '<p class="que_num fl">补贴编号：<span>' + sData.certificate_num + '</span></p>'
//                      html += '<p class="que_size fr">' + voucher_type + '</p>'
//                      html += '</div>'
//                      html += '<div class="acount_detail" onclick="que_module_info(' + sData.id + ')">'
//                      html += '<p class="bz_name">补贴详情</p>'
//                      html += '<p class="bz_time fr">' + time + '</p>'
//                      html += '<p class="bz_count">补贴总金额:<span class="red">' + (sData.amount).toFixed(2) + '</span><span class="red">元</span></p>'
//                      html += '<p class="need_voucher">需使用消费券:<span class="red">' + num + '</span>&nbsp;张</p>'
//                      html+='<p class="bz_people">已进入补贴序列:<span class="red">'+parseFloat(sData.already_amount).toFixed(2)+'元</span></p>'
//                      html += '<p class="wait_people">已补贴金额:<span class="red">' + (sData.payd_amount).toFixed(2) + '</span><span class="red">元</span></p>'
//                      html += '<img src="../../img/acount/is_group.png" class="queue_img" />'
//                      html += '</div>'
//                      html += '<div class="continue_bz fl">'
//                      html += '<p class="cte_txt fl">待补贴金额&nbsp;&nbsp;<span class="red">&yen;</span>'
//                      html += '<span class="red">' + parseFloat(sData.not_bz_amount).toFixed(2) + '元</span>'
//                      html += '<span class="" onclick="contis(this)")">，由系统自动进行排队</span>'
//                      html += '</p>'
//                      html += '</div>'
//                      html += '</div>'
//                  }else{
                        html += '<div class="que_module">'
                        html += '<div class="que_title">'
                        html += '<p class="que_num fl">补贴编号：<span>' + sData.certificate_num + '</span></p>'
                        html += '<p class="que_size fr">' + voucher_type + '</p>'
                        html += '</div>'
                        html += '<div class="acount_detail" onclick="que_module_info(' + sData.id + ')">'
                        html += '<p class="bz_name">补贴详情</p>'
                        html += '<p class="bz_time fr">' + time + '</p>'
                        html += '<p class="bz_count">补贴总金额:<span class="red">' + (sData.amount).toFixed(2) + '</span><span class="red">元</span></p>'
                        html += '<p class="need_voucher">需使用消费券:<span class="red">' + num + '</span>&nbsp;张</p>'
                        //html+='<p class="bz_people">报账档次:<span class="red">'+voucher_type+'</span><span class="red"></span></p>'
                        html += '<p class="wait_people">已补贴金额:<span class="red">' + (sData.payd_amount).toFixed(2) + '</span><span class="red">元</span></p>'
                        html += '<img src="../../img/acount/is_group.png" class="queue_img" />'
                        html += '</div>'
						html += '<div class="continue_bz fl">'
						html += '<p class="cte_txt fl">商家补贴总额'
						html += '<span>' + (sData.shop_amount).toFixed(2) + '元</span>'
						html += '<span class="" onclick="contis(this)")">，已补贴'+(sData.shop_payd_amount).toFixed(2)+'元</span>'
						html += '</p>'
						html += '</div>'
                        html += '</div>'
//                  }
                } else if(bz_state=="2") {
                    html += '<div class="que_module" onclick="que_module_info(' + sData.id + ')">'
                    html += '<div class="que_title">'
                    html += '<p class="que_num fl">补贴编号：<span>' + sData.certificate_num + '</span></p>'
                    html += '<p class="que_size fr">' + voucher_type + '</p>'
                    html += '</div>'
                    html += '<div class="acount_detail">'
                    html += '<p class="bz_name">补贴详情</p>'
                    html += '<p class="bz_time fr">' + time + '</p>'
                    html += '<p class="bz_count">补贴总金额:<span class="red">' + (sData.amount).toFixed(2) + '</span><span class="red">元</span></p>'
                    html += '<p class="wait_people">已补贴金额:<span class="red">' + (sData.payd_amount).toFixed(2) + '</span><span class="red">元</span></p>'
                    html += '<p class="bz_people">补贴次数:共<span class="red">' + sData.bz_count + '</span>次，均完成</p>'
                    html += '<img src="../../img/acount/is_finish.png" class="queue_img" />'
                    html += '</div>'
                    html += '</div>'
                }
            }
            if(ul == null) {

            } else {
                ul.attr("page", parseInt(page) + parseInt(count));
            }

            if(is == true) {
                $("." + item).html(html)
            } else {
                $("." + item).append(html)
            };
            img_srcse();
            return;
        }, function(result) {
            console.log(result)
            mui.toast(result.DESCRIPTION);
            return;
        })
    };

    document.getElementById("back").addEventListener('tap', function() {
        booking.closeAndOpenNewWindow(
            'index.html',
            'index'
        )
    })
    document.getElementById("fp-close").addEventListener('tap', function() {
        $("#fp-src").removeAttr("src");
        $("#fp-img").fadeOut(100);
        setTimeout(function() {
            $(".invoice-fp").css("pointer-events", "all");
        }, 500)
    });
    $('#fp-img').click(function(event) {
        var _con = $('#fp-img');
        if(_con.has(event.target).length === 0) {
            $("#fp-src").removeAttr("src");
            $("#fp-img").fadeOut(100);
            setTimeout(function() {
                $(".invoice-fp").css("pointer-events", "all");
            }, 500)
        }

        //$(".invoice-fp").css("pointer-events","all");
    });
});

function img_srcse() {
    $(".invoice-fp").click(function() {
        var url = $(this).attr("url")
        $("#fp-src").attr("src", booking.constants.ip + url);
        $("#fp-img").fadeIn(100);
        $(this).css("pointer-events", "none");
    })
}

function contis(e) {
    //跳转我要报账页面
    var invoice_id = $(e).attr("id");
    var certificate_num = $(e).attr("num");
    var re_submit = $(e).attr("re_submit");
    var attrValue = {
        INVOICE_ID: invoice_id,
        CERTIFICATE_ID: certificate_num,
        re_submit: re_submit,
        backId: "my_accountss"
    };
    localStorage.setItem("account_reimbur_me_attr",JSON.stringify(attrValue));
    booking.closeAndOpenNewWindow(
        'account_reimbur_me.html',
        'account_reimbur_me'
    )
}


function invoice_info(id) {
    var attrValue = {
        CERTIFICATE_ID: id,
        backId: "my_accountss"
    }
    localStorage.setItem("for_reimbur_attr",JSON.stringify(attrValue));
    booking.closeAndOpenNewWindow(
        'for_reimbur.html',
        'for_reimbur'
    )
}

function que_module_info(id) {
    var attrValue = {
        SC_ID: id,
        backId: "my_accountss"
    };
    localStorage.setItem("my_account_detail_attr",JSON.stringify(attrValue));
    booking.closeAndOpenNewWindow(
        'my_account_detail.html',
        'my_account_detail'
    )
}