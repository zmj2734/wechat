var  auid = localStorage.getItem("auid");
mui.plusReady(function() {

    var tips = '绑定成功！';


    mui.app_request('POST', {
        "OPERATE_TYPE": "10023",
        "AUTH_ID": auid
    }, function(data) {
        if(data.RESULTCODE == "0") {
            $("#pay_getnum").val(data.RESULTLIST.ida_info.real_name)
        }
        return;
    }, function(result) {
        mui.toast("当前网络不给力");
    });

    //查询商铺是否绑定银行卡
    mui.app_request("Post", {
        "OPERATE_TYPE": "10056",
        "AUTH_ID": auid, //localStorage.getItem("auid")
    }, function(result) {
        if(result.is_bind == 1) {
            console.log(JSON.stringify(result));
            //$("#pay_getnum").val(result.shop_bank_account_info.account_num);
            $("#pay_getnum").attr('readonly', 'readonly')
            var account_num = result.shop_bank_account_info.account_num;
            account_num = account_num.substr(account_num.length-4,account_num.length)
            var bank_card = formatBankNo(result.shop_bank_account_info.account_num);
            account_num = '****  ****  ****  ' + account_num;
            $("#id_card").val(account_num);
            $("#id_card").attr('readonly', 'readonly')

            $("#open_bank").val(result.shop_bank_account_info.open_bank_name);

            $("#open_bank").attr('readonly', 'readonly')
            $(".mui-title").html("银行卡")
            $("#requerd").hide();
            $("#edit").show();
        }
        return;
    }, function(result) {
        if(result.RESULTCODE == "-1") {

            mui.toast(result.DESCRIPTION);
        } else {

            mui.toast("当前网络不给力");
        }
    });

    document.getElementById("edit").addEventListener("tap", function() {
        var pay_name = document.getElementById("pay_getnum").value;
        var attrd = {
            "name": pay_name,
            "backId": "bindBank"
        };
        localStorage.setItem("editBank_attr",JSON.stringify(attrd));
        booking.closeAndOpenNewWindow("editBank.html", "editBank");
    })

    //绑定银行卡
    document.getElementById("requerd").addEventListener('tap', function() {
        this.setAttribute('disabled', 'disabled')
        bind_bankcard()
    })
});

//绑定银行卡
function bind_bankcard() {
    var ACCOUNT_NAME = $("#pay_getnum").val();
    var ACCOUNT_NUM = $("#id_card").val();
    var OPEN_BANK_NAME = $("#open_bank").val();
    if(mui.isnull(ACCOUNT_NAME)) {
        mui.toast("账户名不能为空");
        document.getElementById("requerd").removeAttribute('disabled');
        return;
    }
    if(mui.isnull(ACCOUNT_NUM)) {
        mui.toast("账号不能为空");
        document.getElementById("requerd").removeAttribute('disabled');
        return;
    }
    if(mui.isnull(OPEN_BANK_NAME)) {
        mui.toast("开户行不能为空");
        document.getElementById("requerd").removeAttribute('disabled');
        return;
    }
    mui.app_request("Post", {
        "OPERATE_TYPE": "10043",
        "AUTH_ID": auid, //localStorage.getItem("auid")
        "ACCOUNT_NAME": ACCOUNT_NAME,
        "ACCOUNT_NUM": ACCOUNT_NUM,
        "OPEN_BANK_NAME": OPEN_BANK_NAME,
    }, function(result) {
        mui.toast(tips);
        document.getElementById("requerd").removeAttribute('disabled'); //恢复按钮为非禁用
        booking.closeAndOpenNewWindow('bus_accountment.html', 'bus_accountment');

        return;
    }, function(result) {
        if(result.RESULTCODE == "-1") {
            document.getElementById("requerd").removeAttribute('disabled'); //恢复按钮为非禁用
            mui.toast(result.DESCRIPTION);
        } else {
            document.getElementById("requerd").removeAttribute('disabled'); //恢复按钮为非禁用
            mui.toast("当前网络不给力");
        }
    })
}

function formatBankNo(BankNo) {
    if(mui.isnull(BankNo)) return;

    var account = BankNo.substring(0, 22); /*账号的总数, 包括空格在内 */
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

    return account;
}
