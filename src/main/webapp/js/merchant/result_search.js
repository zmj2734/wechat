var SHOP_CATEGORY_ID = null;
var KEY_WORD = null;

var auid = localStorage.getItem("auid");
var count = 0;
var name = null;
var page = 0;
var size = 10;
$(function() {


    KEY_WORD = JSON.parse(localStorage.getItem("result_search_attr")).KEY_WORD;
    var data;
    data = {
        "OPERATE_TYPE": "10101",
        "AUTH_ID": auid,
        "KEY_WORD": KEY_WORD,
        "BEGIN": page,
        "SIZE": size
    };
    //console.log(JSON.stringify(data));
    mui.app_request('POST', data, function(data) {
       // console.log("0: " + JSON.stringify(data));
        if(data.RESULTCODE === "0") {
            var info = data.RESULTLIST.result;
            list_num(info, page, size);
            mui("#shop_list").on("tap", ".bus_info", function() {
                var shop_id = this.getAttribute("shop_id");
                var attrd = {
                    shop_id: shop_id,
                    backId: "city_shop"
                };
                localStorage.setItem("shop_show_attr",JSON.stringify(attrd));
                booking.closeAndOpenNewWindow(
                    'shop_show.html',
                    'shop_show'
                )
            })
        }

    }, function(result) {
        console.log("1: " + JSON.stringify(result))

    });

    document.getElementById("back").addEventListener('tap', function() {
        var attrd = {
            KEY_WORD: KEY_WORD,
            backId: "city_shop"
        };
        localStorage.setItem("shop_search_attr",JSON.stringify(attrd));
        booking.closeAndOpenNewWindowHaveAttr(
            'shop_search.html',
            'shop_search',
            attrd
        )
    });

})

function list_num(info, page, size) {
    var _html = "";
    var html_ = "";
    if(info.length != 0) {

        for(var i = 0; i < info.length; i++) {
            var mi = '';
            if(info[i].juli == "距离未知") {
                mi = info[i].juli;
            } else {
                var gm = info[i].juli / 1000;
                mi = gm.toFixed(1) + "km";
            }
            var urls;
            if(mui.isnull(info[i].shop_title_url)) {
                if(info[i].shop_logo_url.indexOf(";") != -1) {
                    urls = info[i].shop_logo_url.split(";")[0];

                } else {
                    urls = info[i].shop_logo_url;
                }
            }else{
                urls = info[i].shop_title_url;
            }

            _html += '<div class="bus_info fl" shop_id="' + info[i].id + '">';
            _html += '<div class="fl">';
            _html += '<img src="' + booking.constants.ip + urls + '" class="shop_img" />';
            _html += '</div>';
            _html += '<div class="bus_text">';
            _html += '<p class="travel"><span class="fl">' + info[i].shop_name + '</span><span class="f00 fr">' + mi + '</span></p>';
            _html += '<p class="addr">';
            if(!mui.isnull(info[i].consumption)) {
                _html += '<span>&yen;' + info[i].consumption + '/人</span>';
            }
            if(!mui.isnull(info[i].trading_area)) {
                _html += info[i].trading_area + '</p>';
            }
            if(!mui.isnull(info[i].brief_introduction)) {
                _html += '<p class="consumption"><span class="blue fl">' + info[i].brief_introduction + '</span></p>';
            }
            _html += '</div>';
            _html += '</div>';
        }
        $("#shop_list").attr("page", parseInt(page) + size)
        $("#shop_list").append(_html);

    } else if(info.length == 0 && page == 0) {
        _html = '<li class="mui-table-view-cell" style="text-align:center;padding-right:0;line-height:40px;">暂无数据</li>'
        $("#shop_list").html(_html);
    }
}