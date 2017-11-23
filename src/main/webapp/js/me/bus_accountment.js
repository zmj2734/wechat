var my_base_info = null;
var cash_info = null;
var nickName = "";
var pwd_word = "";
var head_image = "";
var domain_url = booking.constants.domain;
var auid = localStorage.getItem("auid");
var card = 0;
var type = null;
var bind_card = null;

var apply_update_state = null;
$(function() {

    //判断是否绑定银行卡
    mui.app_request("Post", {
        "OPERATE_TYPE": "10077",
        "AUTH_ID": auid, //localStorage.getItem("auid")
    }, function(result) {
        card = result.RESULTLIST.is_bind;
        if(result.RESULTLIST.is_bind == 1) {
            $("#yes_bind").show();
        }
        if(result.RESULTLIST.is_bind == 0) {
            $("#yes_bind").hide();
        }

        return;
    }, function(result) {
        if(result.RESULTCODE == "-1") {
            mui.toast(result.DESCRIPTION);
            return;
        } else {
            mui.toast("当前网络不给力");
            return;
        }
    },true);


    //base_info
    mui.app_request('POST', {
        "OPERATE_TYPE": "20022",
        "AUTH_ID": auid
    }, function(data) {
        if(data.RESULTCODE == "0") {
            my_base_info = data.RESULTLIST.my_base_info;
            ida_auth = data.RESULTLIST.ida_auth;
            nickName = my_base_info.nickname;
            pwd_word = my_base_info.pay_pwd;
            head_image = my_base_info.header_img;
            if(!mui.isnull(my_base_info.header_img)) {
                $("#head_img").attr("src", booking.constants.ip + head_image);
            }
            if(!mui.isnull(my_base_info.nickname)) {
                $("#nickname").html(my_base_info.nickname);
            }



        }
        return;
    }, function(result) {
        if(result.RESULTCODE == "-1") {
            mui.toast(result.DESCRIPTION);
        } else {
            mui.toast("当前网络不给力。");
        }
    }, true)


    mui.app_request('POST', {
        "OPERATE_TYPE": "20025",
        "AUTH_ID": auid
    }, function(data) {
        if(data.RESULTCODE == "0") {
            my_shop_info = data.RESULTLIST.my_shop_info;
            apply_update_state = data.RESULTLIST.apply_update_state;
        }
        return;
    }, function(result) {
        if(result.RESULTCODE == "-1") {
            mui.toast(result.DESCRIPTION);
        } else {

            mui.toast("当前网络不给力。");
        }
    }, true)

    //查询商铺是否绑定银行卡
    mui.app_request("Post", {
        "OPERATE_TYPE": "10056",
        "AUTH_ID": auid, //localStorage.getItem("auid")
    }, function(result) {
        bind_card = result.is_bind;
        if(bind_card == 1) {
            $("#yesBank").show();
        } else {
            $("#noBank").show();
        }
        return;
    }, function(result) {
        if(result.RESULTCODE == "-1") {

            mui.toast(result.DESCRIPTION);
        } else {

            mui.toast("当前网络不给力");
        }
    } ,true);

    document.getElementById("heads_img").addEventListener('tap', function() {

        var attrd = {
            "head_imgurl": head_image,
            "backId": "bus_accountment"
        };
        booking.closeAndOpenNewWindowHaveAttr("my_headimg.html", "my_headimg", attrd);
    });

    document.getElementById("exit").addEventListener('tap', function() {
        var btnArray = ['是', '否'];
        mui.confirm('确认解除绑定吗?', '', btnArray, function(e) {
            if(e.index == 0) {
            	var auid = localStorage.getItem("auid");
            	exit(auid) ;
				localStorage.clear();
                booking.closeAndOpenNewWindow("../../start.html", "start");
            } else {
                return;
            }
        });

    });
    
    function exit(openId) {
		$.ajax({
			url : wechat.baseUrl + "/user/unbind",
			data : {
				openId : openId 
			},
			type : "post",
			DataType : "json",
			success : function(data) {
			},
			error : function(){
			}
		})
	}

    document.getElementById("bdpay").addEventListener('tap', function() {

        booking.closeAndOpenNewWindow("bindpay.html", "bindpay");

    });

    document.getElementById("r_name").addEventListener('tap', function() {
        var addrd = {
            "name": nickName,
            "backId": "bus_account_ment"
        }
        localStorage.setItem("set_name_attr",JSON.stringify(addrd));
        booking.closeAndOpenNewWindow("set_name.html", "set_name");
    });

    document.getElementById("pay_pwd").addEventListener('tap', function() {
        if(mui.isnull(pwd_word)) {
            var attrd = {
                "backId": "bus_accountment"
            };
            localStorage.setItem("set_paypassword_attr",JSON.parse(attrd));
            booking.closeAndOpenNewWindowHaveAttr(
                'set_paypassword.html',
                'set_paypassword'
            );

        } else {
            booking.closeAndOpenNewWindow("update_pwd.html", "update_pwd");
        }
    });

    document.getElementById("my_ment").addEventListener("tap", function() {
        if(apply_update_state !=0 ){
            booking.closeAndOpenNewWindow(
                'en_mer_data_ed.html',
                'en_mer_data_ed'
            );
        }else{
            mui.toast("资料审核中，请等待");

        }
    })

    document.getElementById("back").addEventListener("tap", function() {
        booking.closeAndOpenNewWindow("mine.html", "mine")
    })

    document.getElementById("my_bankCard").addEventListener('tap', function() {
        console.log("bind_card:" + bind_card)
        if(bind_card == 0) {
            booking.closeAndOpenNewWindow("bindBankCard.html", "bindBankCard");
        } else if(bind_card == 1) {
            booking.closeAndOpenNewWindow("bind_bankcard.html", "bind_bankcard");
        }

    });
    document.getElementById("r_gotoname").addEventListener('tap', function() {

        mui.openWindow({
            id: 'realnamed',
            url: 'realnamed.html'
        });
    });
    document.getElementById("forgot_pwd").addEventListener('tap', function() {
        if(mui.isnull(pwd_word)) {
            mui.toast("请先设置支付密码");
            return;
        } else {
            var attrd = {
                "backId": "bus_accountment"
            }
            localStorage.setItem("find_pwd_attr",JSON.parse(attrd));
            booking.closeAndOpenNewWindow(
                'find_pwd.html',
                'find_pwd'
            );
        }

    });
})