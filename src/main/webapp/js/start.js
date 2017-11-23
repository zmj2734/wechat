

function start(){
	var islogin = localStorage.islogin;
	if (islogin) {
		window.location.href = "./template/index/index.html";
	} else {
		window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="
				+ wechat.AppId
				+ "&redirect_uri=http://wx.gs-xt.com/wechat&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"
	}
}

$(function() {
	$('body').loading({
		loadingWidth:120,
		title:'',
		name:'test',
		discription:'',
		direction:'column',
		type:'origin',
		originDivWidth:40,
		originDivHeight:40,
		originWidth:6,
		originHeight:6,
		smallLoading:false,
		loadingMaskBg:'rgba(0,0,0,0.2)'
	});
	var code = GetQueryString("code");
	if(code){
		//获取openId
		$.ajax({
			url : wechat.baseUrl + "/user/getUserInfoBycode",
			data : {
				code : code
			},
			type : "get",
			DataType : "json",
			success : function(data) {
				if (data.RESULTCODE == 0) {
                    localStorage.setItem("auid", data.RESULTLIST.open_id);
					if (data.RESULTLIST.user_id) {
						//localStorage.setItem("auid", data.RESULTLIST.open_id);
						localStorage.setItem("istrue",false);
						window.location.href = "./template/index/index.html";
					} else {
						var user = data.RESULTLIST ;
						localStorage.wechatName = user.nickname ;
						localStorage.wechatHead = user.headimgurl ;
						window.location.href = "./template/login/login.html";
					}
				}
			}
		})
	}
})

function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}