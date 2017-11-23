var auid = localStorage.getItem("auid");
var count = 0;
mui.plusReady(function() {

    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    if(isAndroid == true) {
        var height = document.body.clientHeight;
        $("#body_margin").css('margin-top', -80 + "px");
        $("#pullrefresh").css('height', height - 170 + "px");
        $("#pullrefresh").css('margin-top', 208 + "px");
        $("#pullrefresh").css('overflow', ' auto');
    }
    if(isiOS == true) {
        var height = document.body.clientHeight;
        $("#pullrefresh").css('overflow', ' hidden');
        $("#pullrefresh").css('height', height - 140 + "px");
        $("#pullrefresh").css('margin-top', 138 + "px");
        $("#body_margin").css('margin-top', -64 + "px");
    }


    var page = $("#shop_list").attr("page");
    var size = 10;
    mui.app_request('POST', {
        "OPERATE_TYPE": "10040",
        "AUTH_ID": auid,
        "BEGIN": page,
        "SIZE": size,
    }, function(data) {
        if(data.RESULTCODE == "0") {
            var total_amount= data.RESULTLIST.total_amount;
            var turnover_num = 0;
            var result = (total_amount.toString()).indexOf(".");
            if(result != -1) {
                //alert("含有小数点");
                var leng = total_amount.toString().split(".")[1].length;
                if(leng==1){
                    turnover_num = total_amount+'0';
                }else if(leng>2){
                    turnover_num = total_amount.toString().split(".")[0] + '.' + total_amount.toString().split(".")[1].substr(0,2)
                }else{
                    turnover_num = total_amount
                }
            } else {
                turnover_num = total_amount + '.00'
            }
            $("#banlance_common_sub").html(turnover_num)
            //mui('#pullrefresh').pullRefresh().endPullupToRefresh((++page > data.RESULTLIST.totalsize));
            var data = data.RESULTLIST.result;
            var _html = "";
            var html_ = "";
            for(var i = 0; i < data.length; i++) {
                var sData = data[i];
                _html += '<div class="bus_content">';
                _html += '<div class="left_time">';
                _html += '<p><span class="sub_reim">消费补贴：</span><span class="sub_price">' + (sData.amount).toFixed(2) + '</span></p>';
                _html += '<span><span class="sub_time">' + sData.create_time + '</span></span>';
                _html += '</div>';
                _html += '<div class="fr">';
                _html += '<p><span class="other_name">服务商家</span></p>';
                _html += '<span class="other_info fr"><span class="other_peo"></span><span class="other_phone">' + sData.proxy_nickname + '</span></span>';
                _html += '</div>';
                _html += '</div>';
            }
            $("#shop_list").attr("page", parseInt(page) + size)
            $("#shop_list").append(_html);
        }
        return;
    }, function(result) {

        return;
    });
})

function pullupRefresh() {
    setTimeout(function() {
        var page = $("#shop_list").attr("page");
        var size = 10;
        mui.app_request('POST', {
            "OPERATE_TYPE": "10040",
            "AUTH_ID": auid,
            "BEGIN": page,
            "SIZE": size,
        }, function(data) {
            if(data.RESULTCODE == "0") {
                ///$("#banlance_common_sub").html(data.RESULTLIST.total_amount)
                mui('#pullrefresh').pullRefresh().endPullupToRefresh((++page > data.RESULTLIST.totalsize));
                var data = data.RESULTLIST.result;
                var _html = "";
                var html_ = "";
                for(var i = 0; i < data.length; i++) {
                    var sData = data[i];
                    _html += '<div class="bus_content">';
                    _html += '<div class="left_time">';
                    _html += '<p><span class="sub_reim">消费补贴：</span><span class="sub_price">' + (sData.amount).toFixed(2) + '</span></p>';
                    _html += '<span><span class="sub_time">' + sData.create_time + '</span></span>';
                    _html += '</div>';
                    _html += '<div class="fr">';
                    _html += '<p><span class="other_name">服务商家</span></p>';
                    _html += '<span class="other_info fr"><span class="other_peo"></span><span class="other_phone">' + sData.proxy_nickname + '</span></span>';
                    _html += '</div>';
                    _html += '</div>';
                }
                $("#shop_list").attr("page", parseInt(page) + size)
                $("#shop_list").append(_html);
            }
            return;
        }, function(result) {

            return;
        });
    }, 1000)
}

function dateUtil(a) {
    return a.substring(0, 10);
}