var win = null;
var auid = localStorage.getItem("auid");

mui.plusReady(function() {

    mui.app_request('POST', {
        'OPERATE_TYPE': '20018',
        'AUTH_ID': auid,
    }, function(data) {
        if(data.RESULTCODE == '0') {
            console.log(JSON.stringify(data));
            var info = data.RESULTLIST.apply;
            if(mui.isnull(info)){
                return;
            }
            if(info.state == -1) {
                //商铺名称
                document.getElementById("shop_name").innerHTML = info.shop_name;
            }

        }

    }, function(result) {
        if(result.RESULTCODE == "-1") {
            mui.toast(result.DESCRIPTION);
            remDisabled("requerd");
            return;
        }
        remDisabled("requerd");
        mui.toast("当前网络不给力");
        return;
    });
    mui.back = function() {}
    document.getElementById("learn").addEventListener("tap",function(){
        var attrValue = {
            type: 5,
            name: "商家问题",
            backId: "helpcenter"
        };
        localStorage.setItem("helpcenter_list_attr",JSON.stringify(attrValue));
        booking.closeAndOpenNewWindow(
            '../helpcenter/helpcenter_list.html',
            'helpcenter_list'
        )
    })

    document.getElementById("leave").addEventListener("tap",function(){
        booking.closeAndOpenNewWindow("mine.html","mine");
    })

});