var win = null;
var generalizeBaseUrl = booking.constants.ip + "/bz/join/index?user_id=",
    title = '你消费，我补贴!',
    content = content = '加入共生网，不影响正常消费，还能获得额外的消费补贴！共生网与商家和消费者共同打造全新消费格局，共享创业新平台！点击我加入吧！',
    thumbs = [booking.constants.ip + "/static/images/logo.png"],

    pictures = [booking.constants.ip + "/static/images/logo.png"];
var u_id = localStorage.getItem("auid").split("_")[0];
$(function() {

    mui.app_request('POST', {
        'OPERATE_TYPE': '10054',
        'AUTH_ID': localStorage.getItem("auid")
    }, function(data) {
        console.log(JSON.stringify(data))
        if(data.RESULTCODE == '0') {
            var code_img = booking.constants.ip + data.qr_code_url;
            console.log(code_img)
            $("#my_code").attr("src", code_img);
        }
    }, function(result) {
        if(result.RESULTCODE == '-1') {
            mui.toast(result.DESCRIPTION);
        }
    });

    generalizeBaseUrl = generalizeBaseUrl + u_id;
    document.getElementById("my-mui-invit-close").addEventListener("tap", function() {
        $("#share_window").hide();
    })
    document.getElementById("my-mui-btn").addEventListener("tap", function() {
        $("#share_window").show();
    })

    mui("#share_share").on("tap", '.wchat', function() {
        var id = this.getAttribute('data_id');
        var ex = this.getAttribute('data_ex');
        //初始化推广渠道信息
        initSysShareSerivces(function() {
            var weixin = 'weixin',
                sinaweibo = 'sinaweibo';
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