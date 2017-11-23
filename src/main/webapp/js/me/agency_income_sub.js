var list_num = 0;
var auid = null;
var size = 10;
$(function(){
    if(mui.os.ios) {
        var height = document.body.clientHeight;
        $("#pullrefresh").css('overflow', ' hidden');
        $("#pullrefresh").css('height', height - 140 + "px");
        $("#pullrefresh").css('margin-top', 138 + "px");
        $("#body_margin").css('margin-top', -77 + "px");
    } else if(mui.os.android) {
        var height = document.body.clientHeight;
        $("#body_margin").css('margin-top', -80 + "px");
        $("#pullrefresh").css('height', height - 164 + "px");
        $("#pullrefresh").css('margin-top', 141 + "px");
        $("#pullrefresh").css('overflow', ' auto');
    }

    auid = localStorage.getItem("auid");
    mui.app_request('POST', {
        "OPERATE_TYPE": "10061",
        "AUTH_ID": auid,
        "BEGIN": list_num,
        "SIZE": size
    }, function(data) {
        if(data.RESULTCODE == "0") {
            $("#total_amount").html("&yen;"+data.RESULTLIST.total_amount)
            var list = data.RESULTLIST.result;
            listData(list);
            list_num = list_num + size;
        }
        return;
    }, function(result) {
        if(result.RESULTCODE == "-1") {
            mui.toast(result.DESCRIPTION);
        } else {
            mui.toast("当前网络不给力");
        }
        return;
    });
});
//加载更多
function fundmore() {
    setTimeout(function() {
        auid = localStorage.getItem("auid");
        if(!auid) {
            $("#nomessage").css("display", "block");
            mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
            return;
        }
        mui.app_request('POST', {
            "OPERATE_TYPE": "10061",
            "AUTH_ID": auid,
            "BEGIN": list_num,
            "SIZE": size
        }, function(data) {
            if(data.RESULTCODE == "0") {

                var list = data.RESULTLIST.result;
                listData(list);
                list_num = list_num + size;
                if(list.length < 1) {
                    mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
                } else {
                    mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
                }
            }
            return;
        }, function(result) {
            if(result.RESULTCODE == "-1") {
                mui.toast(result.DESCRIPTION);
            } else {
                mui.toast("当前网络不给力");
            }
            return;
        });
    }, 1500);
}

function getDate(a) {
    var date = new Date(a);
    return a.substring(0, 10);
}

function listData(list) {
    var _html = "";
    for(var i = 0; i < list.length; i++) {
        _html += '<div class="with_content">';
        _html += '<div class="left_time">';
        _html += '<p><span class="sub_type">' + list[i].des + '</span></p>';
        _html += '<span><span class="get_time">' + list[i].create_time + '</span></span>';
        _html += "</div>";
        _html += '<div class="fr">';
        _html += '<p><span class="profit">' + list[i].amount + '</span></p>';
        _html += '</div></div>';
    }
    $("#messages").append(_html);
}