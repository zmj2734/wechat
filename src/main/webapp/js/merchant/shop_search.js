var auid = localStorage.getItem("auid");
var auth_shop = "shop" + auid.split("_")[0];
var KEY_WORD=null;
$(function() {


    initHistory();
    var val =localStorage.getItem("shop_search_attr");
    if(val){
        KEY_WORD=JSON.parse(val).KEY_WORD;
        if(!mui.isnull(KEY_WORD)){
            $("#search").val(KEY_WORD)
            $(".mui-placeholder span:last-child").hide();
        }

    }
    document.getElementById("back").addEventListener('tap', function() {
        $("#search").blur();
        booking.closeAndOpenNewWindow(
            'city_shop.html',
            'city_shop'
        )
    });

    //热门搜索
    mui.app_request('POST', {
        "OPERATE_TYPE": "10097",
        "AUTH_ID": auid,
        "BEGIN": 0,
        "SIZE": 10
    }, function(data) {
        console.log("000:"+JSON.stringify(data))
        if(data.RESULTCODE == "0") {
            var data = data.RESULTLIST.result;
            var html = '';
            for(var i=0;i<data.length;i++){
                html+='<span id="'+data[i].id+'" text="'+data[i].key_word+'">'+data[i].key_word+'</span>'
            }
            $("#remen").html(html)
        }

    }, function(result) {
        mui.toast(result.DESCRIPTION)

    });

    mui(".my-search").on("tap", "span", function() {
        //$("#search").blur();
        var shop_id = this.getAttribute("id");
        var shop_name = this.getAttribute("text");
        saveHistory(shop_id, shop_name);
        var attrValue = {
            shop_id: shop_id,
            KEY_WORD:shop_name,
            backId: "city_shop"
        };
        localStorage.setItem("result_search_attr",JSON.stringify(attrValue));
        booking.closeAndOpenNewWindow(
            'result_search.html',
            'result_search'
        )
    })
});
//商铺搜索
var fisrt = null;
var two = null;
var isType = true;
function searchdild() {
    var KEY_WORD = $("#search").val();
    //var re = /^[\u4e00-\u9fa5]+$/;
    if(mui.isnull(KEY_WORD)) {
        return;
    }
    if(KEY_WORD === first) {
        return;
    }
    if(KEY_WORD === two) {
        return;
    }
    first = KEY_WORD;
    mui.app_request('POST', {
        "OPERATE_TYPE": "10038",
        "AUTH_ID": auid,
        "KEY_WORD": KEY_WORD,
//						"BEGIN": 0,
//						"SIZE": 10
    }, function(data) {
        console.log("00"+JSON.stringify(data))
        if(data.RESULTCODE == "0") {
            two = KEY_WORD;
            var info = data.RESULTLIST.result;
            var html = '';
            if(info.length!=0){
                for(var i=0;i<info.length;i++){
                    html+='<li class="mui-table-view-cell my-li" id="'+info[i].id+'" text="'+info[i].shop_name+'"><a>'+info[i].shop_name+'</a></li>'
                }
            }else{
                html+='<li class="mui-table-view-cell"><a>未搜索到结果</a></li>'
            }

            $("#content").html(html);
//							if(info.length==0){
//								$("#result").hide()
//							}else{
            $("#result").show()
//							}
            mui("#content").on("tap", ".my-li", function() {
                //$("#search").blur();
                if(isType==true){
                    $("#result").hide();
                    isType = false;
                    var shop_id = this.getAttribute("id");
                    var shop_name = this.getAttribute("text");
                    saveHistory(shop_id, shop_name);
                    var attrValue = {
                        shop_id: shop_id,
                        KEY_WORD:shop_name,
                        backId: "city_shop"
                    }
                    localStorage.setItem("result_search_attr",JSON.stringify(attrValue));
                    booking.closeAndOpenNewWindow(
                        'result_search.html',
                        'result_search'
                    )
                }

            })
        }
        return;
    }, function(result) {

        return;
    });
};
function Shop(shop_id, shop_name) {
    this.shop_id = shop_id;
    this.shop_name = shop_name;
}
function saveHistory(shop_id, shop_name) {
    var historyMobile = localStorage.getItem(auth_shop);

    var shop = new Shop(shop_id, shop_name);
    if(historyMobile) {
        var list = JSON.parse(historyMobile);

        for(var i = 0; i < list.length; i++) {
            if(list[i].shop_id == shop_id) {
                list.splice(i, 1);
                list.push(shop);
                localStorage.setItem(auth_shop, JSON.stringify(list));
                return;
            }
        }

        if(list.length >= 10) {
            list.splice(0, 1);
            list.push(shop);
            localStorage.setItem(auth_shop, JSON.stringify(list));
            return;
        } else {
            list.push(shop);
            localStorage.setItem(auth_shop, JSON.stringify(list));
            return;
        }

    } else {
        var list = new Array();
        list.push(shop);
        localStorage.setItem(auth_shop, JSON.stringify(list));
    }
}
function initHistory() {
    var historyMobile = localStorage.getItem(auth_shop);
    if(historyMobile) {
        var list = JSON.parse(historyMobile);
        console.log("list:"+JSON.stringify(list))
        var html = "";
        for(var i = list.length - 1; i >= 0; i--) {
            html+='<span id="'+list[i].shop_id+'" text="'+list[i].shop_name+'">'+list[i].shop_name+'</span>'
        }
        $("#historyShop").html(html);
    }
}