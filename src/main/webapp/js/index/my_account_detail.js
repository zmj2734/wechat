var SC_ID = null;
var auid = localStorage.getItem("auid");
$(function() {
    SC_ID = JSON.parse(localStorage.getItem("my_account_detail_attr")).SC_ID;
    mui.app_request('POST', {
        "OPERATE_TYPE": "10066",
        "AUTH_ID": auid, //localStorage.getItem("auid")
        "SC_ID": SC_ID,
    }, function(data) {
        if(data.RESULTCODE == "0") {
            var data = data.RESULTLIST;
            var fp_url = '';
            if(mui.isnull(data.invoice_url)) {
                $(".invoice_bar").hide();
                $(".pay").show();
            } else {
                $(".invoce_img").attr("src", booking.constants.ip + data.invoice_url);
                $(".invoice_bar").show();
                $(".pay").hide();
            }
            var html = '';
            for(var i = 0; i < data.result.length; i++) {
                var sData = data.result[i];

                if(sData.bz_count == sData.bzd_count && sData.bzd_count != 0 && sData.bz_count != 0) {
                    html += '<div class="coupon_finish"><img src="../../img/acount/invoce.png" class="discount" />\
									<p class="cou_shopname">共生网消费券</p><p class="cou_discount">此券为20元档</p><p class="in_finish">已完成</p>\
									<p class="cou_number">编号:<span>2017 0804 1123 4519 4519 4519 4519 4519</span></p>\
									</div>'

                } else {
                    var day = sData.estimate_days;

                    //								html += '<div class="coupon"><img src="../../img/acount/invoce.png" class="discount" />\
                    //									<p class="cou_shopname">共生网消费券</p><p class="cou_discount">此券为' + sData.grade + '</p><div class=" my-coupon"><p class="">需完成' + sData.bz_count + '次</p>\
                    //									<p class="mt_no">已完成<span class="is_finish">&nbsp;<span class="blue">' + sData.bzd_count + '</span>&nbsp;</span>次</p></dv>\
                    //									<p class="cou_number">编号:<span>' + sData.certificate_num + '</span></p>\
                    //									</div>
                    html += '<div class="coupon">'
                    html += '<img src="../../img/acount/invoce.png" class="discount" />'
                    html += '<p class="cou_shopname">共生网消费券</p>'
                    html += '<p class="cou_discount">此券为' + sData.grade + '</p>'
                    html += '<div class=" my-coupon">'
                    html += '<p class="">需完成' + sData.bz_count + '次</p>'
                    html += '<p class="mt_no">已完成<span class="is_finish">&nbsp;<span class="blue">' + sData.bzd_count + '</span>&nbsp;</span>次</p>'
                    if(day < 0) {

                    } else if(day == 0) {
                        html += '<p class="c098">下次补贴预估<span class="blue">&lt;1</span>天</p>'
                    } else if(day > 60) {
                        html += '<p class="c098">下次补贴预估<span class="blue">60+</span>天</p>'
                    } else {
                        html += '<p class="c098">下次补贴预估<span class="blue">' + day + '</span>天</p>'
                    }
                    html += '</div>'
                    html += '<p class="mui-icon mui-icon-help my-p"></p>'
                    html += '<p class="cou_number">编号:<span>' + sData.certificate_num + '</span></p>'
                    html += '</div>'
                }
            }
            $("#coupon").html(html);
            mui("#coupon").on("tap", ".my-p", function() {
                document.getElementById("refuse").style.display = "block";
            });
        }
        return;
    }, function(result) {
        if(result.RESULTCODE == "-1") {
            mui.toast(result.DESCRIPTION);
        } else {
            mui.toast("当前网络不给力。");
        }
    });
    document.getElementById("refuse_no").addEventListener('tap', function() {
        document.getElementById("refuse").style.display = "none";
        //mui.toast('敬请期待!');
    });
})