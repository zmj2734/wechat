var auid = localStorage.getItem("auid");
var helpId = null;
var win = null;
var title = null;
var content = null;
var thumbs = [booking.constructor.ip + "/static/images/logo.png"];
var pictures = [booking.constructor.ip + "/static/images/logo.png"];
$(function() {
    win =   JSON.parse(localStorage.getItem("helpcenter_con_attr"));
    helpId = win.helpId;

    var generalizeBaseUrl = booking.constants.api_ip + "/gswRubs/app_help_center/helpcenter_con?id=" + helpId;


        //获取内容
        console.log(helpId + "||" + helpId)
        mui.app_request('POST', {
            "OPERATE_TYPE": "20008",
            "AUTH_ID": auid,
            "ID": helpId
        }, function(data) {
            if(data.RESULTCODE == "0") {
                var data = data.RESULTLIST.result;
                content = data.indexed_text;
                if(content.length > 20) {
                    content = content.substring(0, 20);
                }
                title = '共生网丨' + data.title
                $("#content").html(data.content_url);
            }

        }, function(result) {
            mui.toast("当前网络不给力。");

        });
        document.getElementById("btn_submit").addEventListener("tap", function() {
            mui('#share_window').popover('hide');
        });
        mui(".price_pays").on("tap", '.share_channel', function() {
            var id = this.getAttribute('data_id');
            var ex = this.getAttribute('data_ex');

            //初始化推广渠道信息
            initSysShareSerivces(function() {
                var weixin = 'weixin';
                if(id == weixin) {
                    shareAction(id, generalizeBaseUrl, title, content, thumbs, pictures, ex);
                } else if(id == sinaweibo) {
                    shareAction(id, generalizeBaseUrl, title, content, null, null, null);
                } else {
                    shareAction(id, generalizeBaseUrl, title, content, thumbs, pictures, null);
                }
            });
        });

});