var  auid = localStorage.getItem("auid");
var ch_type = null;
var v_num = null;
var win = null;
var vgrade = null;
$(function() {


    win = JSON.parse(localStorage.getItem("give_friend_attr"));
    ch_type = win.vtype;
    v_num = win.v_num;
    vgrade = win.vgrade;
    $("#isuse").html(v_num);
    $("#voucher_nun").html(v_num);
    $("#status").html(vgrade);
    var html = '';
    html += '	<div class="mui-numbox" data-numbox-min="1" data-numbox-max="' + v_num + '"  >';
    html += '<button class="mui-btn mui-btn-numbox-minus" type="button">-</button>';
    html += '<input class="mui-input-numbox" type="number" id="sec_size" onkeypress="return event.keyCode>=48&&event.keyCode<=57" />';
    html += '<button class="mui-btn mui-btn-numbox-plus" type="button">+</button></div>';
    $("#after_jia_jian").after(html);
    mui('.mui-numbox').numbox();

    $("#sec_size").on("blur", function() {
        var val = $(this).val();
        var reg = /^\d+$/;
        var _div = $(this).parent().parent();
        if(!reg.test(val)) {
            $(this).val("0");
            mui.toast("只能输入正整数。")
            return;
        } else if(parseInt(val) > v_num) {
            mui.toast("您最多可送" + v_num + "张");
        }

    })

    document.getElementById('give_other').addEventListener('click', function() {
        var give_number = document.getElementById('friend_num').value;
        var give_size = document.getElementById('sec_size').value;
        mui.confirm("是否赠送"+ give_size +"张消费券给用户"+ give_number + "？", function(e) {
            if(e.index == 0) {
                return;
            } else {

                mui.app_request('POST', {
                    'OPERATE_TYPE': '10029',
                    'AUTH_ID': auid,
                    'GIVE_MOBILE': give_number,
                    'NUM': give_size,
                    'VOUCHER_TYPE': ch_type
                }, function(data) {
                    if(data.RESULTCODE == '0') {
                        mui.toast('赠送成功!');
                        mui.app_back(win.backId, "true");
                    }
                }, function(result) {
                    if(result.RESULTCODE == '-1') {
                        mui.toast(result.DESCRIPTION);
                    }
                });
            }
        }, "提示", ["取消", "确定"]);
    });
});