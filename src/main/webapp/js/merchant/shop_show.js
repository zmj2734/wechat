var win = null;
var shop_id = null;
var auid = localStorage.getItem("auid");
var longitude = null;
var latitude = null;
var generalizeBaseUrl = booking.constants.api_ip + "/gswRubs/h5/shop_detail?shop_id=";


wx.ready(function(){
        wx.onMenuShareAppMessage({
            title: '邀请您加入共生网！',
            desc: '我正在共生网参与“消费100补贴100”活动，进店消费即可获取消费补贴！快来吧！',
            link: "http://wx.gs-xt.com/wechat/template/merchant/shop_show.html",
            imgUrl: "http://wx.gs-xt.com/wechat/img/introIMG/send.png",
            trigger: function (res) {
            },
            success: function (res) {
                mui.toast('分享成功');
            },
            cancel: function (res) {
                alert('已取消');
            },
            fail: function (res) {
                //alert(JSON.stringify(res));
            }
        });
        //alert('已注册获取“发送给朋友”状态事件');



        wx.onMenuShareTimeline({
            title: '邀请您加入共生网！',
            link: "http://wx.gs-xt.com/wechat/template/merchant/shop_show.html",
            imgUrl: "http://wx.gs-xt.com/wechat/img/introIMG/send.png",
            trigger: function (res) {
            },
            success: function (res) {
                mui.toast('分享成功');
            },
            cancel: function (res) {
                alert('已取消');
            },
            fail: function (res) {
                //alert(JSON.stringify(res));
            }
        });
        //alert('已注册获取“分享到朋友圈”状态事件');

});


$(function () {

    win = JSON.parse(localStorage.getItem("shop_show_attr"));
    shop_id = win.shop_id;
    var user_id = auid.split("_")[0];
    generalizeBaseUrl = generalizeBaseUrl + shop_id + "&lct=" + user_id;


    document.getElementById("back").addEventListener('tap', function () {
        booking.closeAndOpenNewWindow(
            'city_shop.html',
            'city_shop'
        )
    });

    mui.app_request('POST', {
        "OPERATE_TYPE": "10039",
        "SHOP_ID": shop_id,
        "AUTH_ID": auid
    }, function (data) {
        if (data.RESULTCODE == "0") {
            var info = data.RESULTLIST.result;

            longitude = info.longitude;
            latitude = info.latitude;
            var html = '';
            var last = info.shop_logo_url.substr(info.shop_logo_url.length - 1, 1);
            var urls = info.shop_logo_url;
            if (last == ";") {
                urls = urls.substr(0, urls.length - 1)
            }
            if (urls.indexOf(";") != -1) {
                var urls = urls.split(";");
                for (var i = 0; i < urls.length; i++) {
                    html += '<li><a href="#"><img src="' + booking.constants.ip + urls[i] + '" class="ban_img" /></a></li>'
                }
                $(".banner_img").html(html)
                banner()
            } else {
                html = '<li><a href="#"><img src="' + booking.constants.ip + info.shop_logo_url + '" class="ban_img" /></a></li>'
                $(".banner_img").html(html)
            }
            //地址
            $("#shop_address").html(info.district_name + '&nbsp;&nbsp;' + info.addr);
            //简介
            $("#des").html(info.des);
            //档次
            $("#vt_grade").html(info.vt_grade);
            //电话
            $("#phone_num").html(info.phone_num);
            $("#bd-phone").attr("href", "tel:" + info.phone_num)
            //店铺名
            $("#shop_name").html(info.shop_name);

            $("#shop_hours").html(info.shop_hours);
            $(".mui-title").html( info.shop_name);
        }

    }, function (result) {

    });

    document.getElementById("ditu").addEventListener("tap", function () {

        wx.openLocation({
            latitude:  parseFloat(latitude), // 纬度，浮点数，范围为90 ~ -90
            longitude: parseFloat(longitude), // 经度，浮点数，范围为180 ~ -180。
            scale: 12 // 地图缩放级别,整形值,范围从1~28。默认为最大
        });

    });


});
function banner() {
    TouchSlide({
        slideCell: "#banner",
        titCell: ".hb ul",
        mainCell: ".db ul",
        effect: "leftLoop",
        autoPage: true,
        autoPlay: true,
    });
}