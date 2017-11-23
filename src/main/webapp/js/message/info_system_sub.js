var list_num = 0;
var auid = localStorage.getItem("auid");
var size = 10;
window.onload = function(){
    $(function() {

        mui(".navlist").on("tap", "a", function() {
            var id = $(this).attr("id");
            var data = $(this).attr("data");
            var url = "../" + id + "/" + data + ".html";

            if(id ==="message"){

            }else{
                booking.closeAndOpenNewWindow(url,id);
            }
        });

        mui.app_request('POST', {
            "OPERATE_TYPE": "20001",
            "AUTH_ID": auid
        }, function(data) {
            localStorage.setItem("message", data.message);
        }, function(result) {
        },true);

        mui.app_request('POST', {
                "OPERATE_TYPE": "10047",
                "AUTH_ID": auid,
                "BEGIN": list_num,
                "SIZE": size
            }, function(data) {
                if(data.RESULTCODE == "0") {
                    var info = data.RESULTLIST.result;
                    if(info.size == 0) {
                        mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
                    }

                    addlistNO(info);
                    list_num = list_num + size;

                }

            },
            function(result) {
                if(result.RESULTCODE === "-1") {
                    mui.toast(result.DESCRIPTION);

                } else {
                    mui.toast("当前网络不给力");

                }
            });

    });
}

//加载更多
function listmore() {
    setTimeout(function() {

        mui.app_request('POST', {
                "OPERATE_TYPE": "10047",
                "AUTH_ID": auid,
                "BEGIN": list_num,
                "SIZE": size
            }, function(data) {
                if(data.RESULTCODE == "0") {
                    var info = data.RESULTLIST.result;

                    addlistNO(info);
                    list_num = list_num + size;
                    if(info.length < size) {
                        mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
                    } else {
                        mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
                    }
                    return;
                }
            },
            function(result) {
                if(result.RESULTCODE == "-1") {
                    mui.toast(result.DESCRIPTION);
                    return;
                } else {
                    mui.toast("当前网络不给力");
                    return;
                }
            });
    }, 1500);
}
//
function addlistNO(datas) {
    var _html = "";
    for(var i = 0; i < datas.length; i++) {
        _html += '<div class = "infoContent clearfix" style="margin-top:4px">';
        _html += '<div class = "margin" >';
        _html += '<p class = "i_title">' + datas[i].title + '</p> ';
        _html += '<p class = "i_number">' + datas[i].des + '</p>';
        _html += '</div>';
        _html += '<div class = "fr">';
        _html += '<span class="time">' + datas[i].create_time + '</span>';
        _html += '</div></div>';
    }
    $("#messages").append(_html);


}

function dateUtil(a) {
    var year = a.substring(0, 4);
    var month = a.substring(4, 6);
    var day = a.substring(6, 8);
    return year + "年" + month + "月" + day + "日";
}

function AmOrPm(a) {
    var date = new Date(a.replace(/-/g, "/"));

    var hours = date.getHours();
    var minutes = date.getMinutes();
    if(minutes < 10) {
        minutes = "0" + minutes;
    }
    if(hours > 12) {
        return "PM" + date.getHours() + ":" + minutes;
    } else {
        return "AM" + date.getHours() + ":" + minutes;
    }
}

