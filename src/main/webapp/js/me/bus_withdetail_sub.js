var list_num = 0;
var  auid = localStorage.getItem("auid");
$(function() {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    if(isAndroid == true) {
        var height = document.body.clientHeight;
        $("#body_margin").css('margin-top', -80 + "px");
        $("#pullrefresh").css('height', height - 80 + "px");
        $("#pullrefresh").css('margin-top', 80 + "px");
        $("#pullrefresh").css('overflow', 'auto');
    }
    if(isiOS == true) {
        var height = document.body.clientHeight;
        $("#pullrefresh").css('overflow', ' hidden');
        $("#pullrefresh").css('height', height - 50 + "px");
        $("#pullrefresh").css('margin-top', 50 + "px");
        $("#body_margin").css('margin-top', -50 + "px");
    }


    mui.app_request('POST', {
        "OPERATE_TYPE": "10053",
        "AUTH_ID": auid,
        "BEGIN": list_num,
        "SIZE": "10"
    }, function(data) {

            var list = data.RESULTLIST.result;
            listData(list);
            list_num = list_num + 10;


    }, function(result) {
        if(result.RESULTCODE == "-1") {
            mui.toast(result.DESCRIPTION);
        } else {
            mui.toast("当前网络不给力");
        }

    });

})
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
            "OPERATE_TYPE": "10053",
            "AUTH_ID": auid,
            "BEGIN": list_num,
            "SIZE": "10"
        }, function(data) {
            if(data.RESULTCODE == "0") {
                var list = data.RESULTLIST.result;
                listData(list);
                list_num = list_num + 10;
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
    alert(a);
    return a.substring(0, 10);
}

function listData(list) {
    var _html = "";
    for(var i = 0; i < list.length; i++) {
        _html += '<div class="bus_content">';
        _html += '<div class="left_time">';
        _html += '<p><span class="sub_money">' + list[i].amount + '</span></p>';
        _html += '<p class="t_ime"><span class="get_time">' + list[i].create_time + '</span></p>';
        _html += "</div>";
        _html += '<div class="fr">';
        _html += '<p><span class="money_status y_sh">' + list[i].des + '</span></p>';
        _html += '</div></div>';
    }
    $("#messages").append(_html);
}