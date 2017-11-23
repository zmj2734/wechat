var auid = null;
mui.plusReady(function() {
    auid = localStorage.getItem("auid");

    //判断是否绑定支付宝
    mui.app_request('POST', {
        "OPERATE_TYPE": "10077",
        "AUTH_ID": auid //localStorage.getItem("auid")
    }, function(data) {
    	console.log(data)
        if(data.RESULTCODE == "0") {
            if(data.RESULTLIST.is_bind == "1") {
                $("#requerd").hide();
                $(".mui-title").html("支付宝")
                var num = data.RESULTLIST.alipay_account_info.account_num;
                if(num.indexOf("@")>-1){

                }else{
                    num = replacePhone(num)
                }
                $("#pay_num").val(num).attr("readonly", "readonly");
                $("#pay_name").val(data.RESULTLIST.alipay_account_info.real_name).attr("readonly", "readonly");
                document.getElementById("title").innerHTML = "我的支付宝";
                $("#edit").show();
            } else {
                is_bind();
            }
        }
        return;
    }, function(result) {

    });

    document.getElementById("edit").addEventListener("tap", function() {
        var pay_name = document.getElementById("pay_name").value;
        var attrd = {
            "name": pay_name,
            "backId": "bindpay"
        };
        localStorage.setItem("editAlipay",JSON.parse(attrd));
        booking.closeAndOpenNewWindow("editAlipay.html", "editAlipay");
    })

    document.getElementById("requerd").addEventListener('tap', function() {
        setDisabled("requerd");
        var status = this.getAttribute("status");
        if(status == "fasle" || status == false) {
            remDisabled("requerd");
            return;
        }
        var paynum = $("#pay_num").val();
        //					var paypwd = $("#pay_pwd").val();
        var payname = $("#pay_name").val();
        if(mui.isnull(paynum)) {
            mui.toast("支付宝账号不能为空");
            remDisabled("requerd");
            return;
        }
        //					if(mui.isnull(paypwd)) {
        //						mui.toast("支付宝密码不能为空");
        //						remDisabled("requerd");
        //						return;
        //					}
        if(!payname) {
            mui.toast("支付宝姓名不能为空");
            remDisabled("requerd");
            return;
        }
        this.setAttribute("status", "false");
        mui.app_request('POST', {
            "OPERATE_TYPE": "10020",
            //"PAY_PWD": paypwd,
            "ACCOUNT_NUM": paynum,
            "REAL_NAME": payname,
            "AUTH_ID": auid //localStorage.getItem("auid")
        }, function(data) {
            if(data.RESULTCODE == "0") {
                $("#requerd").attr("status", "true");
                mui.toast("绑定成功");
                booking.closeAndOpenNewWindow("account_ment.html", "account_ment");
            }
            remDisabled("requerd");
            return;
        }, function(result) {
            $("#requerd").attr("status", "true");
            if(result.RESULTCODE == "-1") {
                mui.toast(result.DESCRIPTION);
            } else {
                mui.toast("当前网络不给力！")
            }
            remDisabled("requerd");
        });
    })

});

function is_bind() {
    mui.app_request('POST', {
        "OPERATE_TYPE": "10023",
        "AUTH_ID": auid //localStorage.getItem("auid")
    }, function(data) {
        if(data.RESULTCODE == "0") {
            $("#pay_name").val(data.RESULTLIST.ida_info.real_name)
        }
        return;
    }, function(result) {
        if(result.RESULTCODE == "-1") {
            mui.toast(result.DESCRIPTION);
        } else {
            mui.toast("当前网络不给力！")
        }
    });
}