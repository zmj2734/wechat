var uuid = null;
var auid = localStorage.getItem("auid");
var checId = false;
var win = null;
var mobile = null;
$(function() {

    win = JSON.parse(localStorage.getItem("editBank_attr"));
    document.getElementById("trueName").innerHTML = win.name;
    mui.app_request('POST', {
        "OPERATE_TYPE": "20022",
        "AUTH_ID": auid
    }, function(data) {
        if(data.RESULTCODE == "0") {
            mobile = data.RESULTLIST.my_base_info.username;
        }
        return;
    }, function(result) {
        mui.toast("当前网络不给力");
    });

    document.getElementById("up_send").addEventListener("tap", function() {
        $("input").blur();
        var send = document.getElementById("up_send");
        booking.smsTime_new(send);
        mui.app_request('POST', {
            "OPERATE_TYPE": "10001",
            "MOBILE": mobile,
            "B_TYPE": "49"
        }, function(data) {
            if(data.RESULTCODE == "0") {
                uuid = data.RESULTLIST.UUID;
            }
            return;
        }, function(data) {
            if(data.RESULTCODE == "-1") {
                mui.toast(data.DESCRIPTION);
            } else {
                mui.toast("当前网络不给力！");
            }
            return;
        });

    })

    //登录的点击事件
    document.getElementById("login").addEventListener('tap', function() {
        setDisabled("login");
        $("input").blur();
        var account = document.getElementById("payAccount").value;
        var code = document.getElementById("code").value;
        var forBank = document.getElementById("forBank").value;

        if(mui.isnull(account)) {
            mui.toast("请输入银行卡号");
            remDisabled("login");
            return;
        }
        if(mui.isnull(forBank)) {
            mui.toast("请输入正确的银行卡号")
            remDisabled("login");
            return;
        }

        if(mui.isnull(code)) {
            mui.toast("验证码不能为空");
            remDisabled("login");
            return;
        }
        if(mui.isnull(uuid)) {
            mui.toast("请先发送验证码");
            remDisabled("login");
            return;
        }

        mui.app_request('POST', {
            "OPERATE_TYPE": "10087",
            "AUTH_ID": auid,
            "SMS_CODE": code,
            "ACCOUNT_NUM": account,
            "OPEN_BANK_NAME": forBank,
            "UUID": uuid
        }, function(data) {
            if(data.RESULTCODE == "0") {
                remDisabled("login");
                mui.toast("修改成功");
                uuid = null;
                booking.closeAndOpenNewWindow(
                    'mine.html',
                    'mine'
                )
            }

            remDisabled("login");
            return;
        }, function(data) {
            if(data.RESULTCODE == "-1") {
                mui.toast(data.DESCRIPTION);
            } else {
                mui.toast("当前网络不给力！");
            }
            remDisabled("login");
            return;
        });
    });

})



function formatBankNo(BankNo) {
    if(BankNo.value == "") return;
    var account = new String(BankNo.value);

    account = account.substring(0, 30); /*账号的总数, 包括空格在内 */
    if(account.match(".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}") == null) {
        /* 对照格式 */
        if(account.match(".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" + ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" +
                ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" + ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}") == null) {
            var accountNumeric = accountChar = "",
                i;
            for(i = 0; i < account.length; i++) {
                accountChar = account.substr(i, 1);
                if(!isNaN(accountChar) && (accountChar != " ")) accountNumeric = accountNumeric + accountChar;
            }
            account = "";
            for(i = 0; i < accountNumeric.length; i++) { /* 可将以下空格改为-,效果也不错 */
                if(i == 4) account = account + " "; /* 账号第四位数后加空格 */
                if(i == 8) account = account + " "; /* 账号第八位数后加空格 */
                if(i == 12) account = account + " "; /* 账号第十二位后数后加空格 */
                if(i == 16) account = account + " ";
                if(i == 20) account = account + " ";
                account = account + accountNumeric.substr(i, 1)
            }
        }
    } else {
        account = " " + account.substring(1, 5) + " " + account.substring(6, 10) + " " + account.substring(14, 18) + "-" + account.substring(18, 25);
    }
    //				var bank = testBank(account.replace(/\s/g, ""));
    //				document.getElementById("forBank").value = bank;
    if(account != BankNo.value) BankNo.value = account;
}