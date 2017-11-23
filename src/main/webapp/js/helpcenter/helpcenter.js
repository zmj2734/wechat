var auid = localStorage.getItem("auid");
var generalizeBaseUrl = booking.constants.api_ip + "/gswRubs/app_help_center/help_center";
var title = '共生网丨帮助中心';
var content = '玩转共生网，走上致富路，你要的答案都在这里！';
var thumbs = [booking.constructor.ip + "/static/images/logo.png"];
var pictures = [booking.constructor.ip + "/static/images/logo.png"];

$(function () {


    document.getElementById("back").addEventListener("tap", function () {
        mui.openWindow("../me/mine.html", "mine");
    });
    //获取常见问题
    mui.app_request('POST', {
        "OPERATE_TYPE": "20007",
        "AUTH_ID": auid,
        "TYPE": 1
    }, function (data) {

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
                localStorage.setItem("helpcenter_con_attr",JSON.stringify(attrd));
                mui.openWindow({
                    url: "helpcenter_con.html",
                    id: "helpcenter_con"
                });

            })


    }, function (result) {
        mui.toast("当前网络不给力。");

    });
    mui("#commodity_icon").on("tap", 'li', function () {
        var type = this.getAttribute('type');
        var name = $(this).children("p").html();

        var attrValue = {
            type: type,
            name: name,
            backId: "helpcenter"
        };
        localStorage.setItem("helpcenter_list_attr",JSON.stringify(attrValue));
        booking.closeAndOpenNewWindow(
            'helpcenter_list.html',
            'helpcenter_list'
        )
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

});