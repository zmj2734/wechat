var auid = localStorage.getItem("auid");
var type = null;
var name = null;
var title = '邀请您加入共生网！';
var content = '我正在共生网参与“消费100补贴100”活动，进店消费即可获取消费补贴！快来吧！';
var thumbs = [booking.constructor.ip + "/static/images/logo.png"];
var pictures = [booking.constructor.ip + "/static/images/logo.png"];
var win = null;
$(function() {


    document.getElementById("back").addEventListener("tap", function () {
        mui.openWindow("helpcenter.html", "helpchenter");
    });
    win = JSON.parse(localStorage.getItem("helpcenter_list_attr"));
    type = win.type;
    name = win.name;
    var generalizeBaseUrl = booking.constants.api_ip + "/gswRubs/app_help_center/helpcenter_list?pb_type=" + type;
    if (type == 2) {
        title = '共生网丨平台与账户相关问题';
        content = '平台账户，知己知彼，你要的答案都在这里！'
    } else if (type == 3) {
        title = '共生网丨消费补贴相关问题';
        content = '补贴规则，领取流程，你要的答案都在这里！'
    } else if (type == 4) {
        title = '共生网丨线上商城相关问题';
        content = '消费购物，售后保障，你要的答案都在这里！'
    } else if (type == 5) {
        title = '共生网丨关于商家的相关问题';
        content = '商业合作，店铺经营，你要的答案都在这里！'
    } else if (type == 6) {
        title = '共生网丨收益与提现相关问题';
        content = '多元收益，坐等收钱，你要的答案都在这里！'
    } else if (type == 7) {
        title = '共生网丨邀请机制相关问题';
        content = '分享邀请，共同致富，你要的答案都在这里！'
    }

    $("#name").html(name);
    $("#titie_name").show();
    //	alert(type)
    //获取常见问题
    mui.app_request('POST', {
        "OPERATE_TYPE": "20007",
        "AUTH_ID": auid,
        "TYPE": type
    }, function (data) {
        if (data.RESULTCODE == "0") {
            var data = data.RESULTLIST.result;
            var _html = '';
            for (var i = 0; i < data.length; i++) {
                var sData = data[i];
                _html += '<li class="mui-table-view-cell" id="' + sData.id + '">\
									<a href="" class="mui-navigate-right">' + (i + 1) + '.' + sData.title + '</a>\
								</li>'
            }
            $("#content").html(_html);
            mui("#content").on("tap", "li", function () {
                var helpId = $(this).attr("id");
                var attrd = {
                    "helpId": helpId,
                    backId: "helpcenter"
                }
                localStorage.setItem("helpcenter_con_attr", JSON.stringify(attrValue));
                mui.openWindow({
                    url: "helpcenter_con.html",
                    id: "helpcenter_con",
                    extras: attrd
                });
                return;
            })
        }
        return;
    }, function (result) {
        mui.toast("当前网络不给力。");
        return;
    });
    document.getElementById("btn_submit").addEventListener("tap", function () {
        mui('#share_window').popover('hide');
    });
    mui(".price_pays").on("tap", '.share_channel', function () {
        var id = this.getAttribute('data_id');
        var ex = this.getAttribute('data_ex');

        //初始化推广渠道信息
        initSysShareSerivces(function () {
            var weixin = 'weixin';
            if (id == weixin) {
                shareAction(id, generalizeBaseUrl, title, content, thumbs, pictures, ex);
            } else if (id == sinaweibo) {
                shareAction(id, generalizeBaseUrl, title, content, null, null, null);
            } else {
                shareAction(id, generalizeBaseUrl, title, content, thumbs, pictures, null);
            }
        });
    });
})