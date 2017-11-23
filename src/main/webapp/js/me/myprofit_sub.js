mui.init({
	swipeBack:true,
	pullRefresh: {
		container: '#pullrefresh',
		up: {
			contentrefresh: "正在刷新...",
			callback: pulldownRefresh
		}
	}
});
var list_num = 0;
var auid = null;
var size = 10;
$(function() {
	var u = navigator.userAgent;
	var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
	var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

//				if(isAndroid == true) {
//					var height = document.body.clientHeight;
//					$("#body_margin").css('margin-top', -80 + "px");
//					$("#pullrefresh").css('height', height - 164 + "px");
//					$("#pullrefresh").css('margin-top', 210 + "px");
//					$("#pullrefresh").css('overflow', 'auto');
//					$("#pullrefresh").css('width', '100%');
//				}
//				if(isiOS == true) {
//					var height = document.body.clientHeight;
//					$("#pullrefresh").css('overflow', ' hidden');
//					$("#pullrefresh").css('height', height - 134 + "px");
//					$("#pullrefresh").css('margin-top', 180 + "px");
//					$("#body_margin").css('margin-top', -50 + "px");
//					$("#pullrefresh").css('width', '100%');
//				}

	auid = localStorage.getItem("auid");
	if(!auid) {
		$("#nomessage").css("display", "block");
		mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
		return;
	}
	mui.app_request('POST', {
			"OPERATE_TYPE": "10057",
			"AUTH_ID": auid, //localStorage.getItem("auid")
			"BEGIN": list_num,
			"SIZE": size
		}, function(data) {
			if(data.RESULTCODE == "0") {
				$("#total_amonut").html("&yen;"+data.RESULTLIST.total_amount);
				var banlist = data.RESULTLIST.result;
				if(banlist.size == 0) {
					$("#nomessage").css("display", "block");
					mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				}
				addlistNO(banlist);
				list_num = list_num + size;
				return;
			}
		},
		function(result) {
			if(result.RESULTCODE == "-1") {
				mui.toast(result.DESCRIPTION);
				return;
			} else {
				mui.toast("当前网络不给力");
				return;
			}
		});
});

function pulldownRefresh() {
	setTimeout(function() {
		auid = localStorage.getItem("auid")
		if(!auid) {
			$("#nomessage").css("display", "block");
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
			return;
		}
		mui.app_request('POST', {
				"OPERATE_TYPE": "10057",
				"AUTH_ID": auid,
				"BEGIN": list_num,
				"SIZE": size
			}, function(data) {
				if(data.RESULTCODE == "0") {
					var banlist = data.RESULTLIST.result;

					addlistNO(banlist);
					list_num = list_num + size;
					if(banlist.length < size) {
						mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
					} else {
						//alert(123)
						mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
					}
					return;
				}
			},
			function(result) {
				if(result.RESULTCODE == "-1") {
					mui.toast(result.DESCRIPTION);
					return;
				} else {
					mui.toast("当前网络不给力");
					return;
				}
			});
	}, 1500);
}

function addlistNO(datas) { 
	var _html = "";
	for(var i = 0; i < datas.length; i++) {
		_html += '<div class="with_content">';
		_html += '<div class="left_time">';
		_html += '<p><span class="sub_type">' + datas[i].des + '</span></p>';
		_html += '<span><span class="get_time">' + datas[i].create_time + '</span></span>';
		_html += '</div>';
		_html += '<div class="fr">';
		_html += '<p><span class="profit">' + datas[i].amount + '</span></p>';
		_html += '</div>';
		_html += '</div>';
	}
	//list_num++;

	$("#profit").append(_html);
}

function dateUtil(a) {
	return a.substring(0, 10);
}