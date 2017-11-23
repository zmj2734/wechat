mui.init({
	swipeBack: true,
});
var auid = null;
var type = null;
var win = null;
var typeOneClass = "give_anduses";
$(function() {
    win = JSON.parse(localStorage.getItem("voucher_mine_attr"));
	//win = plus.webview.currentWebview();
	type = win.type;
	if(type != 1) {
		$("#buy").show();
		document.getElementById("shop").innerHTML = "商家消费券";
	}
	auid = localStorage.getItem("auid");
	mui.app_request('POST', {
		"OPERATE_TYPE": "10022",
		"AUTH_ID": auid,
	}, function(data) {
		if(data.RESULTCODE == "0") {
			var sData = data.RESULTLIST.result;
			var html = '';
			var a = 0;
			for(var i = 0; i < sData.length; i++) {
				var aData = sData[i];
				var give_num = parseInt(aData.num);
				var use_num = parseInt(aData.available_num);
				if(give_num != 0 || use_num != 0) {
					var grade = aData.grade;
					grade = grade.substr(0, 2);
					html += '<div class="dis_content" id="dis_list"><div class="dis_lists" >';
					html += '<img src="../../img/mine/mypor.png" class="discount"/>';
					html += '<p class="grade">此券为' + grade + '消费券</p>'
					html += ' <p class="is_yusesize">' + (use_num + give_num) + '张</p></div>';
					html += '	<div class="sd_tips show_orhid" id="show_tip" style="display:none">';
					if(type == 1) {
						html += '	<div class="' + typeOneClass + ' give_andus fl">';
						html += '<img src="../../img/mine/use.png" class="fl lt_img" />';
						html += '<input type="hidden"  class="type_vou" value="' + aData.voucher_type + '"/>';
						html += '<input type="hidden"  class="grade_abc" value="' + grade + '"/>';
						html += '<p class="give_frid">立即使用<span>(<span class="vou_num">' + use_num + '</span>张)</span></p>';
						html += '</div>';
					} else {
						html += '	<div class="give_anduse fl">';
						html += '<img src="../../img/mine/give.png" class="fl lt_img" />';
						html += '<input type="hidden"  class="type_vou" value="' + aData.voucher_type + '"/>';
						html += '<input type="hidden"  class="grade_abc" value="' + grade + '"/>';
						html += '<p class="give_frid">赠送给好友<span>(<span class="vou_num">' + give_num + '</span>张)</span></p>';
						html += '</div>';

						html += '	<div class="give_andus fl">';
						html += '<img src="../../img/mine/use.png" class="fl lt_img" />';
						html += '<input type="hidden"  class="type_vou" value="' + aData.voucher_type + '"/>';
						html += '<p class="give_frid">立即使用<span>(<span class="vou_num">' + use_num + '</span>张)</span></p>';
						html += '</div>';
					}
					html += '<p class="vou_tips">温馨提示:点立即使用即可进行消费补贴申请</p>';
					html += '</div></div>';

				}
			}
			$("#di_list").html(html);
			document.getElementById("detail").addEventListener("tap", function() {
				mui.openWindow("voucher_history.html", "voucher_history");
			})

			mui("#di_list").on('tap', '.dis_lists', function() {
				var show = this.parentNode.querySelector(".show_orhid");
				if(show.style.display == 'none') {

					show.style.display = 'block';
				} else {

					show.style.display = 'none';
				}
			});

			mui(".mui-content").on('tap', '.give_anduse', function() {
				var ch_type = this.querySelector('.type_vou').value;
				var ch_num = this.querySelector('.vou_num').innerHTML;
				var vgrade = this.querySelector('.grade_abc').value;

				if(ch_num == 0 || ch_num == "0") {
					return;
				}
				mui.openWindow({
					id: "give",
					url: "give_friend.html",
					extras: {
						vgrade: vgrade,
						vtype: ch_type,
						v_num: ch_num,
						backId: "voucher_mine"
					}
				})
			});
			mui(".mui-content").on('tap', '.give_andus', function() {
				var ch_type = this.querySelector('.type_vou').value;
				var ch_num = this.querySelector('.vou_num').innerHTML;

				if(ch_num == 0 || ch_num == "0") {
					return;
				}
				mui.openWindow({
					id: "reim_me",
					url: "../index/reimbur_me.html",
					extras: {
						"vtype": ch_type,
						"backId": "voucher_mine"
					}
				})
			});
		}
		return;
	}, function(data) {
		if(data.RESULTCODE == "-1") {
			mui.toast(result.DESCRIPTION)
		} else {
			mui.toast("当前网络不给力")
		}
	});
	document.getElementById('buy').addEventListener('tap', function() {
		mui.openWindow({
			id: 'buy_voucher',
			url: '../business/buy_voucher.html'
		})
	});
})