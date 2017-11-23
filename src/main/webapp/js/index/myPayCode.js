var auid = localStorage.getItem("auid");
$(function() {
    //获取商家收款二维码
    mui.app_request("Post", {
        "OPERATE_TYPE": "10048",
        "AUTH_ID": auid
    }, function(result) {
        var img = booking.constants.ip + result.qr_cord_url;
        $("#code_image").attr("src", img);

    }, function(result) {
        if(result.RESULTCODE === "-1") {
            mui.toast(result.DESCRIPTION);
        } else {
            mui.toast("当前网络不给力。")
        }
    })
    mui.app_request("Post", {
        "OPERATE_TYPE": "20025",
        "AUTH_ID": auid //localStorage.getItem("auid")
    }, function(result) {
        var shop_name = result.RESULTLIST.my_shop_info.shop_name;

        $("#shopname").html(shop_name);

    }, function(result) {
        if(result.RESULTCODE == "-1") {
            mui.toast(result.DESCRIPTION);
        } else {
            mui.toast("当前网络不给力。")
        }
    });
    document.getElementById("click-see").addEventListener('tap', function() {
        booking.closeAndOpenNewWindow(
            '.././me/turnover_sub.html',
            'turnover_sub'
        )
    });
})