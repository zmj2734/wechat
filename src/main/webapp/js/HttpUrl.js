//请求数据的url
var HttP='http://106.14.45.207:9988';
var furl =HttP+"/bz/outinterface/doBusiness";
//图片的url
//我的公共的js
//  获取url中的参数的方法(查询字符串)
function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return unescape(r[2]);
	return null;
}