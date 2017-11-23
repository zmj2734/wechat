var auid = localStorage.getItem("auid");
var size = 15;
$(function() {


    mui.app_request('POST', {
        "OPERATE_TYPE": "10098",
        "BEGIN": "0",
        "SIZE": size
    }, function(data) {
        if(data.RESULTCODE == "0") {

            var infolist = data.RESULTLIST.result;
            var page = 0;
            list_num(infolist, page, size)

        }
    }, function(result) {
        if(result.RESULTCODE == "-1") {
            mui.toast(result.DESCRIPTION)
        }
    });

});

function dynamic() {
    setTimeout(function() {
        var page = $("#scoll_content").attr("page");
        mui.app_request('POST', {
            "OPERATE_TYPE": "10098",
            "BEGIN": page,
            "SIZE": size
        }, function(data) {
            if(data.RESULTCODE == "0") {
                mui('#pullrefresh').pullRefresh().endPullupToRefresh((++page > data.RESULTLIST.totalsize));
                var infolist = data.RESULTLIST.result;
                list_num(infolist, page, size);
            }
        }, function(result) {
            if(result.RESULTCODE == "-1") {
                mui.toast(result.DESCRIPTION)
            }
        });
    }, 1000);
}

function dataUtil(time_data) {
    var date = new Date(time_data.replace(/-/g, "/"));
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minutes = date.getMinutes();
    if(hour < 10) {
        hour = "0" + hour;
    }
    if(minutes < 10) {
        minutes = "0" + minutes;
    }
    //return month + "月" + day + "日" // "  " + hour + ":" + minutes;
    return hour + ":" + minutes;
}

function list_num(infolist, page, size) {
    var info_list = '';
    if(infolist.length > 0) {
        $("#no-dt").hide();
        for(var i = 0; i < infolist.length; i++) {
            info_list += '<li class="mui-table-view-cell">';
            info_list += '<div class="info_pos">';
            info_list += '<img src="../../img/home/info_msg.png" class="info_icon fl" />';
            info_list += '<p class="msg_time"><span class="in_day">' + dataUtil(infolist[i].create_time) + '</span><span class="in_phone">' + replacePhone(infolist[i].username) + '</span><span class="out_money">' + infolist[i].des + infolist[i].amount + '元</span></p>';
            info_list += '</div></li>';
        }
        $("#scoll_content").attr("page", parseInt(page) + size);
        $("#scoll_content").append(info_list);
    } else if(infolist.length === 0 && page === 0) {
        $("#no-dt").show();
//					_html = '<li class="mui-table-view-cell" style="text-align:center;padding-right:0;line-height:40px;">暂无数据</li>'
//					$("#scoll_content").html(_html);
    }
}