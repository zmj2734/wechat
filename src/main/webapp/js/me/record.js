mui.init({
	swipeBack: true,
	pullRefresh: {
		container: "#pullrefresh", //待刷新区域标识
		up: {
			contentrefresh: "正在加载...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
			callback: fundmore, //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
		},
	}

});
var auid = localStorage.getItem("auid");
var list_num = 0;
var size = 10;
var li_list_num = 0;
var mescroll = null;
var islock = false;
$(function() {
	
	if(mui.os.android) {
		var height = document.body.clientHeight;
		$("#pullrefresh").css('overflow', 'auto');
	}
	if(mui.os.ios) {
		var height = document.body.clientHeight;
		$("#pullrefresh").css('overflow', ' hidden');
	}
	mui.app_request('POST', {
		"OPERATE_TYPE": "20019",
		"AUTH_ID": auid,
		"BEGIN": list_num,
		"SIZE": size
	}, function(data) {
		//console.log(JSON.stringify(data));
		if(data.RESULTCODE == "0") {
			var list = data.RESULTLIST;
			listData(list);
			list_num = list_num + size;
		}
		return;
	}, function(result) {
		if(result.RESULTCODE == "-1") {
			mui.toast(result.DESCRIPTION);
		} else {
			console.log(20019)
			mui.toast("当前网络不给力");
		}
		return;
	});
	document.getElementById("submit").addEventListener('tap', function() {
		mescroll.destroy();
		mescroll = null;
		$("#me-modal").hide();
		$("#my-shop-mx").html("")
	})

});
//加载更多  
function fundmore() {
	setTimeout(function() {

		mui.app_request('POST', {
			"OPERATE_TYPE": "20019",
			"AUTH_ID": auid,
			"BEGIN": list_num,
			"SIZE": size
		}, function(data) {
			if(data.RESULTCODE == "0") {
				var list = data.RESULTLIST;
				listData(list);
				list_num = list_num + size;
				if(list.length < size) {
					mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				} else {
					mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
				}
			}
			return;
		}, function(result) {
			if(result.RESULTCODE == "-1") {
				mui.toast(result.DESCRIPTION);
			} else {
				mui.toast("当前网络不给力");
			}
			return;
		});
	}, 1500)
}

function listData(list) {
	var _html = "";
	console.log("list:" + JSON.stringify(list))
	for(var i = 0; i < list.length; i++) {
		_html += '<div class="my-record" value="' + list[i].shop_id + '" title="' + list[i].shop_name + '">';
		_html += '<h3>';
		_html += '<img src="../../img/default/find.gif" alt="" />';
		_html += '<span class="fl">' + list[i].shop_name + '</span>';
		_html += '<span class="fr">&yen;' + list[i].consume_amount + '</span>';
		_html += '</h3>';
		_html += '<ul>';
		_html += '<li>';
		_html += '<span class="fl">补贴中</span>';
		_html += '<span class="fr">&yen;' + list[i].line_up_amount + '</span>';
		_html += '</li>';
		_html += '<li>';
		_html += '<span class="fl">未排队金额</span>';
		_html += '<span class="fr">&yen;' + list[i].not_queued_amount + '</span>';
		_html += '</li>';
		_html += '<li>';
		_html += '<span class="fl">累计消费笔数</span>';
		_html += '<span class="fr">' + list[i].consume_count + '</span>';
		_html += '</li>';
		_html += '<li>';
		_html += '<span class="fl">最近消费时间</span>';
		_html += '<span class="fr">' + dataUtil(list[i].last_update_time) + '</span>';
		_html += '</li>';
		_html += '</ul>';
		_html += '</div>';
	}
	$("#messages").append(_html);
	mui("#messages").off("tap")
	mui("#messages").on("tap", ".my-record", function() {
		li_list_num = 0;
		var shop_id = this.getAttribute("value");
		var shop_name = this.getAttribute("title");
		$("#shop_name").html(shop_name);
		$("#shop_id_hidden").val(shop_id);
		$("#my-shop-mx").html("");
		console.log(JSON.stringify(mescroll));
		if(mescroll != null) {
			mescroll.resetUpScroll();
			
		} else {
			mescroll = new MeScroll("mescroll", { //第一个参数"mescroll"对应上面布局结构div的id
				//					//如果您的下拉刷新是重置列表数据,那么down完全可以不用配置,具体用法参考第一个基础案例
				//					//解析: down.callback默认调用mescroll.resetUpScroll(),而resetUpScroll会将page.num=1,再触发up.callback
				up: {
					callback: createL //上拉加载的回调
				},
				down: {
					use: false,
					auto: false,
					offset:50,
					callback: createL //下拉刷新的回调,别写成downCallback(),多了括号就自动执行方法了
				}

			});
		}

		createL();

	})

}

function createL() {

	var shop_id = $("#shop_id_hidden").val();
	if(!shop_id) {
		return;
	}
	setTimeout(function() {
		mui.app_request('POST', {
			"OPERATE_TYPE": "20020",
			"AUTH_ID": auid,
			"SHOP_ID": shop_id,
			"BEGIN": li_list_num,
			"SIZE": size
		}, function(data) {
			console.log(JSON.stringify(data))
			if(data.RESULTCODE == "0") {
				var list = data.RESULTLIST;
				if(list.length < size) {
					mescroll.endSuccess(size, false);
					
					
				}

				var html_ = ''
				for(var i = 0; i < list.length; i++) {
					html_ += '<li>';
					html_ += '<span class="fl">' + dataUtil(list[i].create_time) + '</span>';
					html_ += '<span class="fr">' + (list[i].amount).toFixed(2) + '元</span>';
					html_ += '</li>';
				}
				$("#my-shop-mx").append(html_);
				li_list_num = li_list_num + size;
				$("#me-modal").show();
			}
			return;
		}, function(result) {
			if(result.RESULTCODE == "-1") {
				mui.toast(result.DESCRIPTION);
			} else {
				mui.toast("当前网络不给力");
			}
			return;
		});
	}, 1000)

}

function dataUtil(time_data) {
	var date = new Date(time_data);
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var hour = date.getHours();
	var minutes = date.getMinutes();
	if(hour < 10) {
		hour = "0" + hour;
	}
	if(minutes < 10) {
		minutes = "0" + minutes;
	}
	return year + "-" + month + "-" + day + "&nbsp;" + hour + ":" + minutes;
}