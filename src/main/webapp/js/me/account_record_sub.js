window.onload = function() {
	mui('.mui-scroll-wrapper').scroll({
		deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
	});
}
mui.init({
	swipeBack:true
});
//(function($) {
var auid = null;
var first = 0;
$(function() {
	var u = navigator.userAgent;
	var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
	var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

//				if(isAndroid == true) {
//					var height = document.body.clientHeight;
////					$("#body_margin").css('margin-top', -80 + "px");
//					$("#pullrefresh").css('height', height - 125 + "px");
//					$("#pullrefresh").css('margin-top', 125 + "px");
////					$("#pullrefresh").css('padding-bottom', 30 + "px");
//				}
//				if(isiOS == true) {
//					var height = document.body.clientHeight;
//					$("#pullrefresh").css('overflow', ' hidden');
//					$("#pullrefresh").css('height', height - 130 + "px");
//					$("#pullrefresh").css('margin-top', 129 + "px");
////					$("#body_margin").css('margin-top', -64 + "px");
//				}
	mui('.mui-slider').slider().setStopped(true);
	auid = localStorage.getItem("auid");
	//auid = "253_20171006093046488";
	var old_back = mui.back;
//	mui.back = function() {
//		var wobj = plus.webview.getWebviewById("index"); //注意 HBuilder 是   1.html 的 ID  你如果1.html 有ID   要替换掉HBuilder，  
//		old_back()
//	}
	var item = $("#segmentedControl .a_click.mui-active").attr("con");
	var bz_state = $("#segmentedControl .a_click.mui-active").attr("value");
	var ul = $("#segmentedControl .a_click.mui-active");
	var page = $("#segmentedControl .a_click.mui-active").attr("page");
	createFragment(ul, page, bz_state, item, 10, true);

	$("#segmentedControl .a_click").click(function() {
		$(this).addClass("mui-active").siblings().removeClass("mui-active");
		var index = $(this).index();
		$(".mui-slider-group .length").eq(index).show().siblings().hide();
		var item = $(this).attr("con");
		var bz_state = $(this).attr("value");
		var ul = $(this);
		var page = 0;
		createFragment(ul, page, bz_state, item, 10, true);
	});
	//获取报账金额
	mui.app_request('POST', {
		"OPERATE_TYPE": "10041",
		"AUTH_ID": auid,
	}, function(data) {
		if(data.RESULTCODE == "0") {
			$("#banlance_other").html(parseFloat(data.RESULTLIST.total_proxy_amount).toFixed(2))
			$("#banlance_sub").html(parseFloat(data.RESULTLIST.total_amount).toFixed(2))
		}
		return;
	}, function(result) {
		
		return;
	});

	//循环初始化所有下拉刷新，上拉加载。
	$.each($('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
		mui(pullRefreshEl).pullToRefresh({
			up: {
				container: '#pullrefresh',
				contentnomore: '没有更多数据了',
				callback: function() {
					var self = this;
					setTimeout(function() {
						var ul = self.element.querySelector('.mui-table-view');
						var item = ul.getAttribute("con");
						var bz_state = $("#segmentedControl").find(".a_click.mui-active").attr("value");
						var page = $("#segmentedControl").find(".a_click.mui-active").attr("page");
						var ul = $("#segmentedControl").find(".a_click.mui-active");
						createFragment(ul, page, bz_state, item, 10, false)
						//ul.appendChild(createFragment(item,5));
						self.endPullUpToRefresh();
					}, 1000);
				}
			}
		});
	});

	function createFragment(ul, page, bz_state, item, count, is) {
		var data;
		if(bz_state == "0") {
			data = {
				"OPERATE_TYPE": "10040",
				"AUTH_ID": auid, //localStorage.getItem("auid")
				"BEGIN": page,
				"SIZE": count,
			}
		} else {
			data = {
				"OPERATE_TYPE": "10041",
				"AUTH_ID": auid, //localStorage.getItem("auid")
				"BEGIN": page,
				"SIZE": count,
			}
		}
		mui.app_request("Post", data, function(result) {
			var data = result.RESULTLIST.result;
			console.log(JSON.stringify(result));
			var _html = '';
			console.log(first)
			if(first==0){
				$("#banlance_other").html(parseFloat(result.RESULTLIST.total_proxy_amount).toFixed(2))
				$("#banlance_sub").html(parseFloat(result.RESULTLIST.total_amount).toFixed(2))
				first++;
			} 
			if(bz_state == "0") {
				for(var i = 0; i < data.length; i++) {
					var sData = data[i];
					var amount = sData.amount;
					_html += '<div class="bus_content">';
					_html += '<div class="left_time">';
					_html += '<p><span class="sub_reim">消费补贴：</span><span class="sub_price">' + amount.toFixed(2) + '</span></p>';
					_html += '<span><span class="sub_time">' + sData.create_time + '</span></span>';
					_html += '</div>';
					_html += '<div class="fr">';
					_html += '<p><span class="other_name">服务商家</span></p>';
					_html += '<span class="other_info fr"><span class="other_peo"></span><span class="other_phone">' + sData.proxy_nickname + '</span></span>';
					_html += '</div>';
					_html += '</div>';
				}
			} else {
				for(var i = 0; i < data.length; i++) {
					var sData = data[i];
					var amount = sData.amount;
					_html += '<div class="bus_content">';
					_html += '<div class="left_time">';
					_html += '<p><span class="sub_reim">代服务：</span><span class="sub_price">' + amount.toFixed(2) + '</span></p>';
					_html += '<span><span class="sub_time">' + sData.create_time + '</span></span>';
					_html += '</div>';
					_html += '<div class="fr">';
					_html += '<p><span class="other_name"></span></p>';
					
						_html += '<span class="other_info fr"><span class="other_peo">申请人：</span><span class="other_phone">' + sData.proxy_nickname + '</span></span>';
					
					_html += '</div>';
					_html += '</div>';
				}
			}

			if(ul == null) {

			} else {
				ul.attr("page", parseInt(page) + parseInt(count));
			}

			if(is == true) {
				$("." + item).html(_html)
			} else {
				$("." + item).append(_html)
			};
			return;
		}, function(result) {
			mui.toast(result.DESCRIPTION);
			return;
		})
	};

	//跳转我要报账页面
	//				document.getElementById("detail").addEventListener('tap', function() {
	//					mui.app_refresh("reimbur");
	//					mui.openWindow({
	//						id: 'reimbur',
	//						url: 'reimbur_me.html',
	//						extras: {
	//							type: 0,
	//							backId: "reimbur_me"
	//						}
	//					});
	//				});

});

function dateUtil(a) {
	return a.substring(0, 10);
}
//})(mui);