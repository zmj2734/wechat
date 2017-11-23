var win = null;
var auid = localStorage.getItem("auid");

var apply_id = null;
$(function() {
    mui.app_request('POST', {
        'OPERATE_TYPE': '20018',
        'AUTH_ID': auid,
    }, function(data) {
        if(data.RESULTCODE == '0') {
            console.log(JSON.stringify(data));
            var info = data.RESULTLIST.apply;
            apply_id = info.id;

            if(info.state == -1){
                document.getElementById("business_license_num").value =info.business_license_num;
                document.getElementById("business_license_name").value =info.business_license_name;
                document.getElementById("legal_name").value =info.legal_name;
                document.getElementById("img_business_license_url").value =info.business_license_url;
                $("#business_license_url").find("img").attr("src",booking.constants.ip+info.business_license_url);
                $("#card_url").find("img").attr("src",booking.constants.ip+info.card_url);
                $("#id_card_url").find("img").attr("src",booking.constants.ip+info.id_card_url);
                document.getElementById("img_card_url").value =info.card_url;
                document.getElementById("img_id_card_url").value =info.id_card_url;
                if(!mui.isnull(info.proxy_url)){
                    document.getElementById("img_proxy_url").value =info.proxy_url;
                    $("#proxy_url").find("img").attr("src",booking.constants.ip+info.proxy_url);
                }
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

    document.getElementById('requerd').addEventListener('tap', function() {

        setDisabled("requerd");
        //营业执照号
        var business_license_num = document.getElementById("business_license_num").value;
        //执照名称
        var business_license_name = document.getElementById("business_license_name").value;
        //执照法人姓名
        var legal_name = document.getElementById("legal_name").value;
        //营业执照照片
        var business_license_url = document.getElementById("img_business_license_url").value;
        //法人身份证照片
        var card_url = document.getElementById("img_card_url").value;
        //商户负责人手持证件照
        var id_card_url = document.getElementById("img_id_card_url").value;
        //委托书
        var proxy_url = document.getElementById("img_proxy_url").value;
        if(mui.isnull(business_license_num)) {
            mui.toast('请输入营业执照号!');
            remDisabled("requerd");
            return;
        } else if(business_license_num.length > 20) {
            mui.toast('请输入正确的营业执照号!');
            remDisabled("requerd");
            return;
        }
        if(mui.isnull(business_license_name)) {
            mui.toast('请输入执照名称!');
            remDisabled("requerd");
            return;
        }
        if(mui.isnull(legal_name)) {
            mui.toast('请输入执照法人姓名!');
            remDisabled("requerd");
            return;
        }
        if(mui.isnull(card_url)) {
            mui.toast('请上传法人身份证照片!');
            remDisabled("requerd");
            return;
        }
        if(mui.isnull(id_card_url)) {
            mui.toast('请上传商户负责人手持证件照!');
            remDisabled("requerd");
            return;
        }
        if(mui.isnull(business_license_url)) {
            mui.toast('请上传营业执照照片!');
            remDisabled("requerd");
            return;
        }
        var params = {
            'OPERATE_TYPE': '20017',
            'AUTH_ID': auid,
            "APPLY_ID":apply_id,
            "BUSINESS_LICENSE_NUM": business_license_num,
            "BUSINESS_LICENSE_NAME": business_license_name,
            "LEGAL_NAME": legal_name,
            "BUSINESS_LICENSE_URL": business_license_url,
            "CARD_URL": card_url,
            "ID_CARD_URL": id_card_url,
            "PROXY_URL":proxy_url
        }

        mui.app_request('POST', params, function(data) {
            if(data.RESULTCODE == '0') {
                booking.closeAndOpenNewWindowHaveAttr("en_mer_data-thr.html", "en_mer_data-thr");
                remDisabled("requerd");
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

    });
});
mui(".bus_bg").on('tap', '.up_img', function() {

    var ids = this.id;
    if(mui.os.plus) {
        var a = [{
            title: "拍照"
        }, {
            title: "从手机相册选择"
        }];
        plus.nativeUI.actionSheet({
            title: "上传图片",
            cancel: "取消",
            buttons: a
        }, function(b) { /*actionSheet 按钮点击事件*/

            switch(b.index) {
                case 0:
                    break;
                case 1:
                    getImage(1000, 800, ids, "sphotos", uploadSucess); /*拍照*/
                    break;
                case 2:
                    galleryImg(1000, 800, ids, "sphotos", uploadSucess); /*打开相册*/
                    break;
                default:
                    break;
            }
        });
    }
}, false);

document.getElementById('attorney_mode').addEventListener('tap', function() {
    mui.openWindow({
        'id': 'attorney_exp',
        url: 'attorney_exp.html'
    });
})
/*图片开始*/
function uploadSucess(data, id) {

    $("#img_" + id).val(data.RESULTLIST.PATH);
    commom_url = booking.constants.ip + data.RESULTLIST.PATH;
    $("#" + id).find("img").attr("src", commom_url);
    //document.getElementById(id).src = commom_url;
}