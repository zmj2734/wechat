mui.init({
	swipeBack: true
});
var idorhandurl = "";
var auid = null;
$(function() {
	
	auid = localStorage.getItem("auid");
	mui.app_request('POST', {
		"OPERATE_TYPE": "10023",
		"AUTH_ID": auid
	}, function(data) {
		if(data.RESULTCODE == "0") {
			var sData = data.RESULTLIST.ida_info;
			console.log(JSON.stringify(sData));
			$("#name").val(sData.real_name);
			var id_card = sData.id_card;
			var num1 = id_card.substr(0,1);
			var num2 = id_card.substr(id_card.length-1,id_card.length);
			id_card = num1 + '****************' + num2
			$("#idcard").val(id_card);
			$("#address").val(sData.district_name);
			//console.log(JSON.stringify(sData));
			$("#id_url").attr("src", booking.constants.ip + sData.id_card_url);
			//$("#head_img").attr("src", booking.constants.ip + sData.photo_url);
		}
		return;
	}, function(result) {
		return;
	});
});