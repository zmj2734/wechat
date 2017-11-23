mui.init({
	swipeBack:true,
	pullRefresh: {
		container: "#pullrefresh", //待刷新区域标识
		up: {
			contentrefresh: "正在加载...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
			callback: fundmore, //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
		}
	}
});
var auid = localStorage.getItem("auid");
var list_num = 0;
var size = 10;
$(function() {
	if(mui.os.android){
		var height = document.body.clientHeight;
		$("#pullrefresh").css('overflow', 'auto');
	}
	if(mui.os.ios){ 
		var height = document.body.clientHeight;
		$("#pullrefresh").css('overflow',' hidden');
	}
		mui.app_request('POST', {
			"OPERATE_TYPE": "10094",
			"AUTH_ID": auid,
			"BEGIN": list_num,
			"SIZE": size
		}, function(data) {
			console.log(JSON.stringify(data));
			if(data.RESULTCODE == "0") {
				var list = data.RESULTLIST.result;
				listData(list);
				list_num = list_num + size;
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
	
	document.getElementById("detail").addEventListener('tap', function() {
		booking.closeAndOpenNewWindow("voucher_history_exp.html","voucher_history_exp")
	});
});
//加载更多  
function fundmore() {
	setTimeout(function() {
		
		mui.app_request('POST', {
			"OPERATE_TYPE": "10094",
			"AUTH_ID": auid,
			"BEGIN": list_num,
			"SIZE": size
		}, function(data) {
			if(data.RESULTCODE == "0") {
				var list = data.RESULTLIST.result;
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
	for(var i = 0; i < list.length; i++) {
		_html += '<div class="with_content">';
		_html += '<div class="left_time">';
		
		_html += '<p><span class="sub_type">' + list[i].des + '</span></p>';
		_html += '<span><span class="get_time">' + list[i].create_time + '</span></span>';
		_html += "</div>";
		_html += '<div class="fr">';
		if(list[i].num >0){
			_html += '<p><span class="profit red">' + list[i].num + '张</span></p>';
		}else{
			_html += '<p><span class="profit green">' + list[i].num + '张</span></p>';
		}
		
		_html += '</div></div>';
	}
	$("#messages").append(_html);
}