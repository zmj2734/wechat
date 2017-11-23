var auid = localStorage.getItem("auid");

var h2 = 0;
var auth_user_search  = "auth_user_search"+auid.split("_")[0];
$(function() {

    initSerach();
    document.getElementById("addr").addEventListener("tap", function() {
        localStorage.removeItem("search_user_addr");
        booking.closeAndOpenNewWindow("city_shop.html", "city_shop");
    })

});

var fisrt = null;
var two = null;

function searchd() {
    var KEY_WORD = document.getElementById("search").value;

    var re = /^[\u4e00-\u9fa5]+$/;
    if(mui.isnull(KEY_WORD)) {
        return;
    }
    if(!re.test(KEY_WORD)) {
        return;
    }
    if(KEY_WORD.length <= 1) {
        $("#result").hide();
        document.getElementById("content").innerHTML = "";
        return;
    }
    //				if(KEY_WORD === first) {
    //					alert("1");
    //					return;
    //				}
    //				if(KEY_WORD === two) {
    //					alert("2");
    //					return;
    //				}
    $("#result").show();
    first = KEY_WORD;

    AMap.service(["AMap.PlaceSearch"], function() {
        var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
            pageSize: 20,
            pageIndex: 1,
            //城市

            //panel: "panel"
        });
        //关键字查询
        placeSearch.search(KEY_WORD, function(status, result) {
            two = KEY_WORD;
            var html = "";
            var info = result.poiList.pois;
            console.log(JSON.stringify(result));
            if(mui.isnull(info)) {
                return;
            } else {

                for(var i = 0; i < info.length; i++) {
                    html += '<li class="mui-table-view-cell">';
                    html += '<a href="javascript:void(0);" data-name="' + info[i].name + '" data-latitude="' + info[i].location.lat + '" data-longitude="' + info[i].location.lng + '" class="dizhi">' + info[i].name + "-" + info[i].address + '</a>';
                    html += '</li>';
                }
                document.getElementById("content").innerHTML = html;
                mui("#content").off("tap");
                mui("#content").on("tap", ".dizhi", function() {
                    $("input").blur();
                    var latitude = this.getAttribute("data-latitude");
                    var longitude = this.getAttribute("data-longitude");
                    var name = this.getAttribute("data-name");
                    changeAddr(name, latitude, longitude);
                    localStorage.setItem("search_user_addr",name);
                    booking.closeAndOpenNewWindow("city_shop.html", "city_shop");
                })
            }
        });
    });
}

function initSerach() {

    var user_search_addr = localStorage.getItem(auth_user_search);
    if(user_search_addr) {
        var list = JSON.parse(user_search_addr);
        var html = "";
        for(var i = list.length - 1; i >= 0; i--) {
            html += '<li class="mui-table-view-cell">';
            html += '<a href="javascript:void(0);" data-name="' + list[i].addrName + '" data-latitude="' + list[i].latitude + '" data-longitude="' + list[i].longitude + '" class="lishijilu">' + list[i].addrName + '</a>';
            html += '</li>';
        }
        $("#searchd").html(html);

        mui("#searchd").on("tap", ".lishijilu", function() {

            var latitude = this.getAttribute("data-latitude");
            var longitude = this.getAttribute("data-longitude");
            var name = this.getAttribute("data-name");
            changeAddr(name, latitude, longitude);
            localStorage.setItem("search_user_addr",name);
            booking.closeAndOpenNewWindow("city_shop.html", "city_shop");
        })

    }
}

function Search_addr(addrName, latitude, longitude) {
    this.addrName = addrName;
    this.latitude = latitude;
    this.longitude = longitude;
}

function saveSearch(addrName, latitude, longitude) {
    var user_search_addr = localStorage.getItem(auth_user_search);

    var search_addr = new Search_addr(addrName, latitude, longitude);
    if(user_search_addr) {
        var list = JSON.parse(user_search_addr);

        for(var i = 0; i < list.length; i++) {
            if(list[i].addrName == addrName) {
                list.splice(i, 1);
                list.push(search_addr);
                localStorage.setItem(auth_user_search, JSON.stringify(list));
                return;
            }
        }

        if(list.length >= 10) {
            list.splice(0, 1);
            list.push(search_addr);
            localStorage.setItem(auth_user_search, JSON.stringify(list));
            return;
        } else {
            list.push(search_addr);
            localStorage.setItem(auth_user_search, JSON.stringify(list));
            return;
        }

    } else {
        var list = new Array();
        list.push(search_addr);
        localStorage.setItem(auth_user_search, JSON.stringify(list));
    }
}

function changeAddr(name, latitude, longitude) {
    //console.log("name："+name+"latitude:"+latitude+"longitude")
    mui.app_request("Post", {
        "OPERATE_TYPE": "10100",
        "AUTH_ID": localStorage.getItem("auid"),
        "LONGITUDE": longitude,
        "LATITUDE": latitude,
        "ADDR": name
    }, function(result) {
        if(result.RESULTCODE == 0) {
            saveSearch(name, latitude, longitude);
        }
    }, function(result) {

    });
}