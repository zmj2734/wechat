mui.init({
	swipeBack: true
});
var auid = null;
auid = localStorage.getItem("auid");
var bts = [];
$(function() {
	//获取商家收款二维码
	mui.app_request("Post", {
		"OPERATE_TYPE": "10048",
		"AUTH_ID": auid, //localStorage.getItem("auid")
	}, function(result) {
		var img = booking.constants.ip + result.qr_cord_url;
		$("#code_image").attr("src", img);
		return;
	}, function(result) {
		if(result.RESULTCODE == "-1") {
			mui.toast(result.DESCRIPTION);
		} else {
			mui.toast("当前网络不给力")
		}
	})

	//获取商铺折扣类型
	mui.app_request("Post", {
		"OPERATE_TYPE": "10049",
		"AUTH_ID": auid, //localStorage.getItem("auid")
	}, function(result) {
		$(".dis_name").html(result.voucher_type.grade)
		return;
	}, function(result) {
		if(result.RESULTCODE == "-1") {
			mui.toast(result.DESCRIPTION);
		} else {
			mui.toast("当前网络不给力")
		}
	})

	mui.app_request("Post", {
		"OPERATE_TYPE": "10014",
		"AUTH_ID": auid, //localStorage.getItem("auid")
	}, function(result) {
		var html = '';

		for(var i = 0; i < result.RESULTLIST.result.length; i++) {
			var sData = result.RESULTLIST.result[i];
			if(sData.enable == "1") {
				html = '{title:"' + sData.grade + '",id:"' + sData.id + '",price:"' + sData.price + '"}'
				bts.push(html)
			}

		}
		bts = '[' + bts + ',]';
		bts = bts.replace(bts.substring(bts.lastIndexOf(',')), ']');
		bts = eval(bts)
		return;
	}, function(result) {
		if(result.RESULTCODE == "-1") {
			mui.toast(result.DESCRIPTION);
		} else {
			mui.toast("当前网络不给力")
		}
	})

	document.getElementById("sale").addEventListener("tap", function() {
		plus.nativeUI.actionSheet({
				title: "请选择消费券档次",
				cancel: "取消",
				buttons: bts
			},
			function(e) {
				if(e.index == 0) {
					return;
				}
				var des = $('.dis_name').html();
				var num = bts[e.index - 1].price;
				num = parseInt(num);
				var tipHtml = '当前折扣将调整为' + num + '报100'
				mui.confirm(tipHtml, "", function(t) {

					if(t.index == 1) {
						$('.dis_name').html(bts[e.index - 1].title);
						var id = bts[e.index - 1].id;
						set_voucher_type(id);
					} else {
						$('.dis_name').html(des)
					}
				})

			}
		);
	})

})

//设置商铺折扣类型
function set_voucher_type(id) {
	mui.app_request("Post", {
		"OPERATE_TYPE": "10050",
		"AUTH_ID": auid, //localStorage.getItem("auid")
		"VOUCHER_TYPE_ID": id,
	}, function(result) {
		mui.toast(result.DESCRIPTION);
		return;
	}, function(result) {
		if(result.RESULTCODE == "-1") {
			mui.toast(result.DESCRIPTION);
		} else {
			mui.toast("当前网络不给力")
		}
	})
}