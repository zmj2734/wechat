var auid = localStorage.getItem("auid");
var city_name = null;
var page = 0;
var size = 10;
var last = true;
var auth_user_search = "auth_user_search" + auid.split("_")[0];
$(function () {
    mui(".navlist").on("tap", "a", function () {
        var id = $(this).attr("id");
        var data = $(this).attr("data");
        console.log(typeof id)
        var url = "../" + id + "/" + data + ".html";
        if (id == "merchant") {
            return;
        } else {
            booking.closeAndOpenNewWindow(url, id);
        }
    })

    document.getElementById("city_name").addEventListener("tap", function () {
        booking.closeAndOpenNewWindow("addr_search.html", "addr_search");
    })


    $.ajax({
        url : wechat.baseUrl + "/wx/getJsapiTicket",
        data : {
            url : window.location.href.split("#")[0] ,
            jsApiList:
                'checkJsApi,onMenuShareTimeline,onMenuShareAppMessage,onMenuShareQQ,onMenuShareQZone,hideAllNonBaseMenuItem,showAllNonBaseMenuItem,chooseImage,previewImage,uploadImage,downloadImage,getNetworkType,openLocation,getLocation,closeWindow,scanQRCode,chooseWXPay'
        },
        type : "get",
        DataType : "json",
        async: false ,
        success : function(data) {
            if(data.RESULTCODE == 0){
                var noncestr = randomString(20) ;
                var timestamp = new Date().getTime() ;
                var url = window.location.href.split("#")[0] ;
                var temp = "jsapi_ticket="+data.RESULTLIST+"&noncestr="+noncestr+"&timestamp="+timestamp+"&url="+url;
                console.log(temp) ;
                var signature = sha1(temp) ;
                wx.config({
                    debug: true,
                    appId: wechat.AppId,
                    timestamp: timestamp ,
                    nonceStr: noncestr ,
                    signature: signature,
                    jsApiList: [
                        'getLocation'
                    ]
                }) ;
            }
        }
    })


    var searchUserAddr = localStorage.getItem("search_user_addr");

    //alert(city_name)
    if (mui.isnull(searchUserAddr)) {
        var id = document.getElementById("city_name");
        wx.getLocation({
            success: function (res) {
                mui.app_request("Post", {
                    "OPERATE_TYPE": "10100",
                    "AUTH_ID": localStorage.getItem("auid"),
                    "LONGITUDE": res.longitude,
                    "LATITUDE": res.latitude,
                    "ADDR": "",
                    "DISTRICT_NAME": ""
                }, function(result) {
                    var city_name = result.RESULTLIST.user_location.district_name;
                    if(!mui.isnull(id)) {
                        id.innerHTML = city_name;
                    }
                }, function(result) {

                });
            },
            cancel: function (res) {
                alert('用户拒绝授权获取地理位置');
            }
        });
        //mui.cacheUser.uploadLocation(id);
    } else {
        city_name = localStorage.getItem(auth_user_search);
        var addr = JSON.parse(city_name);
        $("#city_name").html(addr[addr.length - 1].addrName);
    }

    //加载商铺
    shop_list();
    //获取分类
    mui.app_request('POST', {
        "OPERATE_TYPE": "10010",
    }, function (data) {
        if (data.RESULTCODE == "0") {
            var aData = data.RESULTLIST.result;
            var _html = "";
            var html_ = "";
            for (var i = 1; i <= aData.length; i++) {
                if (i == 1) {
                    html_ += '<div><li class="cont_icon click_li" name="' + aData[i - 1].category_name + '" id="' + aData[i - 1].id + '">'
                    html_ += '<img src="' + booking.constants.ip + aData[i - 1].icon_url + '" class="com_icon" />'
                    html_ += '<p class="c_pos">' + aData[i - 1].category_name + '</p>'
                    html_ += '</li>'
                } else if (i == aData.length) {
                    html_ += '<li class="cont_icon click_li" name="' + aData[i - 1].category_name + '" id="' + aData[i - 1].id + '">'
                    html_ += '<img src="' + booking.constants.ip + aData[i - 1].icon_url + '" class="com_icon" />'
                    html_ += '<p class="c_pos">' + aData[i - 1].category_name + '</p>'
                    html_ += '</li></div>'
                } else if (i % 8 == 0) {
                    html_ += '<li class="cont_icon click_li" name="' + aData[i - 1].category_name + '" id="' + aData[i - 1].id + '">'
                    html_ += '<img src="' + booking.constants.ip + aData[i - 1].icon_url + '" class="com_icon" />'
                    html_ += '<p class="c_pos">' + aData[i - 1].category_name + '</p>'
                    html_ += '</li></div><div>'
                } else {
                    html_ += '<li class="cont_icon click_li" name="' + aData[i - 1].category_name + '" id="' + aData[i - 1].id + '">'
                    html_ += '<img src="' + booking.constants.ip + aData[i - 1].icon_url + '" class="com_icon" />'
                    html_ += '<p class="c_pos">' + aData[i - 1].category_name + '</p>'
                    html_ += '</li>'
                }
            }
            //console.log(html_ + _html);
            $("#banner_imgge").html(html_ + _html);
            banner();
            //跳转分类列表
            mui("#banner_imgge").on("tap", ".click_li", function () {
                var id = $(this).attr("id");
                var name = $(this).attr("name")
                var attrd = {
                    SHOP_CATEGORY_ID: id,
                    name: name,
                    backId: "city_shop"
                }
                localStorage.setItem("typelist_sub_attr", JSON.stringify(attrd));
                booking.closeAndOpenNewWindow(
                    'typelist_sub.html',
                    'typelist_sub'
                )

            })
        }

    }, function (result) {

    });
    mui("#shop_list").on("tap", ".bus_info", function () {
        var shop_id = this.getAttribute("shop_id");
        var attrd = {
            shop_id: shop_id,
            backId: "city_shop"
        }
        localStorage.setItem("shop_show_attr", JSON.stringify(attrd));
        booking.closeAndOpenNewWindowHaveAttr(
            'shop_show.html',
            'shop_show'
        )
    })
    //搜索店铺名称
    document.getElementById("href-to").addEventListener('tap', function () {
        window.location.href = 'shop_search.html'
    })
});
//	图片轮播
function banner() {
    TouchSlide({
        slideCell: "#banner",
        titCell: ".hb ul",
        mainCell: ".db ul",
        effect: "leftLoop",
        autoPage: true,
        autoPlay: false
    });
}


//加载商铺
function shop_list() {
    //console.log(page)
    setTimeout(function () {
        mui.app_request('POST', {
            "OPERATE_TYPE": "10101",
            "AUTH_ID": auid,
            "BEGIN": page,
            "SIZE": size
        }, function (data) {
            console.log(JSON.stringify(data))
            if (data.RESULTCODE == "0") {
                if (last == true) {
                    last = false
                } else {
                    mui('#pullrefresh').pullRefresh().endPullupToRefresh((++page > data.RESULTLIST.totalsize));
                }
                //last=false;
                page = page + size;
                var info = data.RESULTLIST.result;
                var _html = "";
                var html_ = "";
                for (var i = 0; i < info.length; i++) {

                    var mi = '';
                    if (info[i].juli == "距离未知") {
                        mi = info[i].juli;
                    } else {
                        var gm = info[i].juli / 1000;
                        mi = gm.toFixed(1) + "km";
                    }
                    var urls;

                    if (mui.isnull(info[i].shop_title_url)) {
                        if (info[i].shop_logo_url.indexOf(";") != -1) {
                            urls = info[i].shop_logo_url.split(";")[0];

                        } else {
                            urls = info[i].shop_logo_url;
                        }
                    } else {
                        urls = info[i].shop_title_url;
                    }
                    _html += '<div class="bus_info fl" shop_id="' + info[i].id + '">';
                    _html += '<div class="fl">';
                    _html += '<img src="' + booking.constants.ip + urls + '" class="shop_img" />';
                    _html += '</div>';
                    _html += '<div class="bus_text">';
                    _html += '<p class="travel"><span class="fl">' + info[i].shop_name + '</span><span class="f00 fr">' + mi + '</span></p>';
                    _html += '<p class="addr">';
                    if (!mui.isnull(info[i].consumption)) {
                        _html += '<span>&yen;' + info[i].consumption + '/人</span>';
                    }
                    if (!mui.isnull(info[i].trading_area)) {
                        _html += info[i].trading_area + '</p>';
                    }

                    if (!mui.isnull(info[i].brief_introduction)) {
                        _html += '<p class="consumption"><span class="blue fl">' + info[i].brief_introduction + '</span></p>';
                    }
                    _html += '</div>';
                    _html += '</div>';
                }
                $("#shop_list").append(_html);

            }
            return;
        }, function (result) {
            mui.toast(result.DESCRIPTION)
            return;
        });
    }, 400)
}



