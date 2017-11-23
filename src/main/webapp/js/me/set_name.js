mui.init({
	swipeBack: true
});
var win = null;
var name = "";
var auid = null;
$(function() {
	auid = localStorage.getItem("auid");
	win = JSON.parse(localStorage.getItem("set_name_attr"));
	name = win.name;
	if(!mui.isnull(name)) {
		$("#title_nicename").html("修改昵称");
		document.getElementById("nickname").value = name;
	}

	document.getElementById('save').addEventListener('tap', function() {
		setDisabled("save");
		var nickname = document.getElementById('nickname').value;

		if(nickname.length > 5) {
			mui.toast("昵称长度不能大于5");
			remDisabled("save");
			return;
		}
		mui.app_request('POST', {
			'OPERATE_TYPE': '10009',
			'AUTH_ID': auid,
			'NICKNAME': nickname
		}, function(data) {
			if(data.RESULTCODE != -1) {
				mui.alert('修改成功', function() {
					window.history.back();
					//mui.app_back(win.backId, true);
				});
			}
			remDisabled("save");
		}, function(result) {
			mui.toast(result.DESCRIPTION);
			remDisabled("save");
		});
	});
})