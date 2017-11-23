var auid = localStorage.getItem("auid");
var re_submit = null;
var CERTIFICATE_ID = null;
var INVOICE_ID = null;
var VOUCHER_TYPE = null;
var TOTAL_AMOUNT = 0;
var BZ_AMOUNT = null;
var INVOICE_URL = null;
var USE_BALANCE = null;

var size = 10;
var auth_user = "user" + auid.split("_")[0];
var isLogin = null;
$(function () {
    var attrd = JSON.parse(localStorage.getItem("findpeople_attr"));

    TOTAL_AMOUNT = attrd.TOTAL_AMOUNT;
    BZ_AMOUNT = attrd.BZ_AMOUNT;
    INVOICE_ID = attrd.INVOICE_ID;
    INVOICE_URL = attrd.INVOICE_URL;
    USE_BALANCE = attrd.USE_BALANCE;
    VOUCHER_TYPE = attrd.VOUCHER_TYPE;
    re_submit = attrd.re_submit;
    CERTIFICATE_ID = attrd.CERTIFICATE_ID;
    //console.log("TOTAL_AMOUNTL:" + TOTAL_AMOUNT)

    $(".people_cont").on("tap", ".my-btn", function () {
        $(this).attr("disabled", true);
        $(".people_cont").find("button").removeClass("my-btn-a");
        $(this).addClass("my-btn-a");
        var SELECT_PROXY_USER_ID = $(this).attr("userid");
        var data;
        console.log("TOTAL_AMOUNTL:" + TOTAL_AMOUNT);
        if (mui.isnull(TOTAL_AMOUNT)) {
            TOTAL_AMOUNT = 0;
            //remDisabled("cmt");
        }
        if (re_submit == 1) {
//                console.log("OPERATE_TYPE:" + 10036)
//                console.log("AUTH_ID:" + auid)
//                console.log("CERTIFICATE_ID:" + CERTIFICATE_ID)
//                console.log("BZ_AMOUNT:" + BZ_AMOUNT)
//                console.log("INVOICE_ID:" + INVOICE_ID)
//                console.log("VOUCHER_TYPE:" + VOUCHER_TYPE)
//                console.log("SELECT_PROXY_USER_ID:" + SELECT_PROXY_USER_ID)
//                console.log("USE_BALANCE:" + USE_BALANCE)
//                console.log("USE_VOUCHER:" + 0)
            data = {
                "OPERATE_TYPE": "10036",
                "AUTH_ID": auid, //localStorage.getItem("auid")
                "CERTIFICATE_ID": CERTIFICATE_ID,
                "BZ_AMOUNT": BZ_AMOUNT,
                "INVOICE_ID": INVOICE_ID,
                "VOUCHER_TYPE": VOUCHER_TYPE,
                "SELECT_PROXY_USER_ID": SELECT_PROXY_USER_ID,
                "USE_BALANCE": USE_BALANCE,
                "USE_VOUCHER": 0
            }
        } else {
            data = {
                "OPERATE_TYPE": "10027",
                "AUTH_ID": auid, //localStorage.getItem("auid")
                "TOTAL_AMOUNT": TOTAL_AMOUNT,
                "BZ_AMOUNT": BZ_AMOUNT,
                "INVOICE_ID": INVOICE_ID,
                "INVOICE_URL": INVOICE_URL,
                "VOUCHER_TYPE": VOUCHER_TYPE,
                "SELECT_PROXY_USER_ID": SELECT_PROXY_USER_ID,
                "USE_BALANCE": USE_BALANCE,
                "USE_VOUCHER": 0
            }
        }
        myresult(data);
        $(this).attr("disabled", false);
    });
    initHistory();

    mui.app_request('POST', {
        "OPERATE_TYPE": "10096",
        "AUTH_ID": auid, //localStorage.getItem("auid")
        "BEGIN": "0",
        "SIZE": "10"
    }, function (data) {

        if (data.RESULTCODE == "0") {
            //mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
            var infolist = data.RESULTLIST.result;
            var page = 0;
            list_num(infolist, page, size)

        }

    }, function (result) {
        mui.toast("当前网络不给力。");
    });



    //提交
    document.getElementById("cmt").addEventListener('tap', function () {
        $("input").blur();
        setDisabled("cmt");
        var data;
        var PROXY_MOBILE = $("#friend_num").val();
        if (mui.isnull(PROXY_MOBILE)) {
            mui.toast("请输入服务商家!");
            remDisabled("cmt");
            return false;
        }
        if (mui.isnull(TOTAL_AMOUNT)) {
            TOTAL_AMOUNT = 0;
            //remDisabled("cmt");
        }

        if (re_submit == 1) {
            data = {
                "OPERATE_TYPE": "10036",
                "AUTH_ID": auid, //localStorage.getItem("auid")
                "CERTIFICATE_ID": CERTIFICATE_ID,
                "BZ_AMOUNT": BZ_AMOUNT,
                "INVOICE_ID": INVOICE_ID,
                "VOUCHER_TYPE": VOUCHER_TYPE,
                "PROXY_MOBILE": PROXY_MOBILE,
                "USE_BALANCE": USE_BALANCE,
                "USE_VOUCHER": 0
            }
        } else {
            data = {
                "OPERATE_TYPE": "10027",
                "AUTH_ID": auid, //localStorage.getItem("auid")
                "TOTAL_AMOUNT": TOTAL_AMOUNT,
                "BZ_AMOUNT": BZ_AMOUNT,
                "INVOICE_ID": INVOICE_ID,
                "INVOICE_URL": INVOICE_URL,
                "VOUCHER_TYPE": VOUCHER_TYPE,
                "PROXY_MOBILE": PROXY_MOBILE,
                "USE_BALANCE": USE_BALANCE,
                "USE_VOUCHER": 0
            }
        }
        myresult(data);
    });

    document.getElementById("myModal_no").addEventListener('tap', function () {
        var attrValue = {
            status: "0",
            backId: "index"
        };
        localStorage.setItem("my_accountss_attr",JSON.stringify(attrValue));
        booking.closeAndOpenNewWindow(
            'my_accountss.html',
            'my_accountss'
        )
    });


})

function myresult(data) {
    mui.app_request('POST', data, function (data) {
        console.log(JSON.stringify(data))

        //mui.toast(data.DESCRIPTION);
        var mydata = data.RESULTLIST;
        var mobile = mydata.mobile;
        var header_url = mydata.header_img;
        var SELECT_PROXY_USER_ID = mydata.id;
        var name = mydata.shop_name;
        saveHistory(mobile, header_url, SELECT_PROXY_USER_ID, name);
        setTimeout(function () {
            $("#myModal").fadeIn(100);
        }, 300);

    }, function (result) {
        mui.toast(result.DESCRIPTION);
        $(".people_cont").find("button").removeClass("my-btn-a")
        $("#friend_num").val("");
        remDisabled("cmt");
    });
}

function findpeople() {
    setTimeout(function () {
        var page = $("#people_cont").attr("page");
        mui.app_request('POST', {
            "OPERATE_TYPE": "10096",
            "AUTH_ID": auid
            //						"BEGIN": page,
            //						"SIZE": size
        }, function (data) {
            if (data.RESULTCODE == "0") {
                mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
                //mui('#pullrefresh').pullRefresh().endPullupToRefresh((++page > data.RESULTLIST.totalsize));
                var infolist = data.RESULTLIST.result;
                list_num(infolist, page, size);
            }
        }, function (result) {
            if (result.RESULTCODE == "-1") {
                mui.toast(result.DESCRIPTION)
            }
        });
    }, 1000);
}

function list_num(infolist, page, size) {
    if(infolist.length > 0) {
        var html = '';
        for (var i = 0; i < infolist.length; i++) {
            var sData = infolist[i];
            html += '<li class="mui-input-row mui-radio mui-left">';
            html += '<div class="fl mt-4">';
            html += '<img src="' + booking.constants.ip + sData.header_img + '" class="toux"/>';
            html += '</div>';
            html += '<div class="fl people-p mt-4">';
            html += '<p class="mui-text-left">' + sData.shop_name + '</p>';
            html += '<p class="mui-text-left">' + infolist[i].username + '</p>';
            html += '</div>';
            html += '<div class="fr poposira mr-10">';
            //html += '<input class="my-radio" userid="' + sData.user_id + '" name="radio1" type="radio">';
            html += '<button class="btn-back my-btn fr" userid="' + sData.user_id + '">选择</button>';
            html += '</div>';
            html += '</li>';
        }
        $("#people_cont").append(html);
        $("#people_cont").attr("page", parseInt(page) + size);


    } else if (infolist.length === 0 && page === 0) {
        _html = '<li class="mui-table-view-cell" style="text-align:center;padding-right:0;line-height:40px;">暂无数据</li>'
        $("#scoll_content").html(_html);
    }
}

function Shop(mobile, url, user_id, shop_name) {
    this.mobile = mobile;
    this.url = url;
    this.user_id = user_id;
    this.name = shop_name;
}

function saveHistory(mobile, url, user_id, shop_name) {
    var historyMobile = localStorage.getItem(auth_user);

    var shop = new Shop(mobile, url, user_id, shop_name);
    if (historyMobile) {
        var list = JSON.parse(historyMobile);

        for (var i = 0; i < list.length; i++) {
            if (list[i].mobile == mobile) {
                list.splice(i, 1);
                list.push(shop);
                localStorage.setItem(auth_user, JSON.stringify(list));
                return;
            }
        }

        if (list.length >= 4) {
            list.splice(0, 1);
            list.push(shop);
            localStorage.setItem(auth_user, JSON.stringify(list));
            return;
        } else {
            list.push(shop);
            localStorage.setItem(auth_user, JSON.stringify(list));
            return;
        }

    } else {
        var list = new Array();
        list.push(shop);
        localStorage.setItem(auth_user, JSON.stringify(list));
    }
}

function initHistory() {
    var historyMobile = localStorage.getItem(auth_user);
    if (historyMobile) {
        var list = JSON.parse(historyMobile);
        console.log("list:" + JSON.stringify(list))
        var html = "";
        for (var i = list.length - 1; i >= 0; i--) {
            html += '<li class="mui-input-row mui-radio mui-left">';
            html += '<div class="fl mt-4">';
            html += '<img src="' + booking.constants.ip + list[i].url + '" class="toux"/>';
            html += '</div>';
            html += '<div class="fl people-p mt-4">';
            html += '<p class="mui-text-left">' + list[i].name + '</p>';
            html += '<p class="mui-text-left">' + list[i].mobile + '</p>';
            html += '</div>';
            html += '<div class="fr poposira mr-10">';
            //html += '<input class="my-radio" userid="' + list[i].user_id + '" name="radio1" type="radio">';
            html += '<button class="btn-back my-btn fr" userid="' + list[i].user_id + '">选择</button>';
            html += '</div>';
            html += '</li>';
        }
        $("#historyMobile").html(html);
        $(".my-histroy").show();
    }
}