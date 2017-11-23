var auid = localStorage.getItem("auid");
var list_num = 0;
mui.plusReady(function () {
    mui.app_request('POST', {
        "OPERATE_TYPE": "10058",
        "AUTH_ID": auid,
        "BEGIN": list_num,
        "SIZE": "10"
    }, function (data) {
        if (data.RESULTCODE == "0") {
            $("#total_amount").html("&yen;" + data.RESULTLIST.total_amount)
            var list = data.RESULTLIST.result;
            listData(list);
            list_num = list_num + 10;
        }
        return;
    }, function (result) {
        if (result.RESULTCODE == "-1") {
            mui.toast(result.DESCRIPTION);
        } else {
            mui.toast("当前网络不给力");
        }
        return;
    });

});
//加载更多
function fundmore() {
    setTimeout(function () {
        auid = localStorage.getItem("auid");
        if (!auid) {
            $("#nomessage").css("display", "block");
            mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
            return;
        }
        mui.app_request('POST', {
            "OPERATE_TYPE": "10058",
            "AUTH_ID": auid,
            "BEGIN": list_num,
            "SIZE": "10"
        }, function (data) {

            if (data.RESULTCODE == "0") {

                var list = data.RESULTLIST.result;
                listData(list);
                list_num = list_num + 10;
                if (list.length < 1) {
                    mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
                } else {
                    mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
                }
            }
            return;
        }, function (result) {

            if (result.RESULTCODE == "-1") {
                mui.toast(result.DESCRIPTION);
            } else {
                mui.toast("当前网络不给力");
            }
            return;
        });
    }, 1500)
}

function getDate(a) {
    var date = new Date(a);
    //alert(a);
    return a.substring(0, 10);
}

function listData(list) {
    var _html = "";
    for (var i = 0; i < list.length; i++) {
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