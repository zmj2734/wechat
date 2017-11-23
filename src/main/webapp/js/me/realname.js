mui.init({
	swipeBack: true
});
var idorhandurl = "";
var auid = null;
var filesadded = "";
var re = /^[\u4E00-\u9FA5]+$/;
$(function() {

	$("#address_click").on("click", function() {
		//checkloadjscssfile("../../css/city.css", "css");
		$("input").blur();
		setTimeout(function() {
			$("#address").selectAddress({
				"ajaxURL": booking.constants.api_domain,
				storageBox: $("#address"),
				callback: function(string, id) {
					//执行回调
					var city_id = id;
					if(city_id) {
						$("#address").val(string);
						$("#addr_id").val(city_id);
					}
				}
			});
		}, 500)

	});
})

$(function() {
	auid = localStorage.getItem("auid");
	mui(".mui-content").on('tap', '.photo_img', function() {
		$("#idcard").blur();
		//removejscssfile("../../css/city.css", "css")
		var ids = this.id;
		if(mui.os.plus) {
			var a = [{
				title: "拍照"
			}, {
				title: "从手机相册选择"
			}];
			plus.nativeUI.actionSheet({
				title: "上传图片",
				cancel: "取消",
				buttons: a
			}, function(b) { /*actionSheet 按钮点击事件*/

				switch(b.index) {
					case 0:
						break;
					case 1:
						getImage(1000, 800, ids, "sphotos", uploadSucess) /*拍照*/
						break;
					case 2:
						galleryImg(1000, 800, ids, "sphotos", uploadSucess); /*打开相册*/
						break;
					default:
						break;
				}
			})
		}

	}, false);
	document.getElementById("cmt_info").addEventListener('tap', function() {
		setDisabled("cmt_info");
		$("input").blur();
		var idcard = document.getElementById('idcard').value;
		var name = document.getElementById('name').value;
		var pos_idimg = document.getElementById('img_id_url').value;
		var card = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
		var card2 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
		var card3 = /^[A-Z][0-9]{9}$/; //香港
		var card4 = /^[A-Z][0-9]{6}\\([0-9A]\\)$/; //澳门
		var card5 = /^[157][0-9]{6}\\([0-9]\\)$/; //台湾
		var card_type = document.getElementById("type_int").value;
		var address_name = document.getElementById("address").value;
		var addr_id = document.getElementById("addr_id").value;
		if(mui.isnull(name)) {
			mui.toast('姓名不能为空');
			remDisabled("cmt_info");
			return;
		} else if(!re.test(name)) {
			mui.toast('请输入正确的姓名');
			document.getElementById('name').value = "";
			remDisabled("cmt_info");
			return;
		}
		if(mui.isnull(card_type)) {
			mui.toast('请选择身份证类型');
			remDisabled("cmt_info");
			return;
		}
		if(mui.isnull(idcard)) {
			mui.toast('身份证号不能为空');
			remDisabled("cmt_info");
			return;
		}
		if(mui.isnull(address_name)) {
			mui.toast('请选择您的身份证所在地');
			remDisabled("cmt_info");
			return;
		}
		switch(card_type) {
			case 1:
				if(card.test(idcard) || card2.test(idcard)) {

				} else {
					mui.toast('请输入正确的身份证号');
					remDisabled("cmt_info");
					return;
				}
				break;
			case 2:
				if(card3.test(idcard)) {

				} else {
					mui.toast('请输入正确的身份证号');
					remDisabled("cmt_info");
					return;
				}
				break;
			case 3:
				if(card4.test(idcard)) {

				} else {
					mui.toast('请输入正确的身份证号');
					remDisabled("cmt_info");
					return;
				}
				break;
			case 4:
				if(card5.test(idcard)) {

				} else {
					mui.toast('请输入正确的身份证号');
					remDisabled("cmt_info");
					return;
				}
				break;
			default:
				break;
		}

		if(mui.isnull(pos_idimg)) {
			mui.toast('请上传身份证正面照片');
			remDisabled("cmt_info");
			return;
		}
		mui.app_request('post', {
			"OPERATE_TYPE": "10016",
			"AUTH_ID": auid,
			"ID_CARD": idcard,
			"CARD_TYPE": card_type,
			"REAL_NAME": name,
			"ID_CARD_URL": pos_idimg,
			"DISTRICT_ID": addr_id,
			"DISTRICT_NAME": address_name
		}, function(data) {
			if(data.RESULTCODE == "0") {
				remDisabled("cmt_info");
				mui.toast('提交成功');
				booking.closeAndOpenNewWindow(
					'mine.html',
					'mine'
				)
				return;
			}
			
		}, function(result) {
			remDisabled("cmt_info");
			
			if(result.RESULTCODE == "-1") {
				mui.toast(result.DESCRIPTION);
				return
			} else {
				mui.toast("当前网络不给力");
				return
			}

			
		});
	});
	var typearray = [{
			"value": 1,
			"text": "大陆身份证"
		},
		{
			"value": 2,
			"text": "香港身份证"
		},
		{
			"value": 3,
			"text": "澳门身份证"
		},
		{
			"value": 4,
			"text": "台湾身份证"
		}
	]

	var userPicker = new mui.PopPicker();
	userPicker.setData(typearray);
	var showUserPickerButton = document.getElementById('id_card_type_tap');
	var userResult = document.getElementById('id_card_type');
	showUserPickerButton.addEventListener('tap', function(event) {
		$("input").blur();
		userPicker.show(function(items) {
			userResult.innerHTML = items[0].text;
			$("#type_int").val(items[0].value);
			//返回 false 可以阻止选择框的关闭
			//return false;
		});
	}, false);

	/*图片开始*/
	function uploadSucess(data, id) {
		$("#img_" + id).val(data.RESULTLIST.PATH);
		idorhandurl = booking.constants.ip + data.RESULTLIST.PATH;
		document.getElementById(id).src = idorhandurl;
	}

	mui("#card").on("tap", ".a_click", function() {
		var type = $(this).attr("type");
		var url = $(this).attr("url");
		console.log("type:" + type);
		if(type == 1) {
			$("#icon-tip").html("请按照示例，上传身份证正面")
		}
		$("#icon-card-img").attr("src", url);
		$("#icon-card").show();
	}) 
	document.getElementById("icon-card").addEventListener('tap', function() {
		$(this).hide();
	});
});

function removejscssfile(filename, filetype) {
	//判断文件类型 
	var targetelement = (filetype == "js") ? "script" : (filetype == "css") ? "link" : "none";
	//判断文件名 
	var targetattr = (filetype == "js") ? "src" : (filetype == "css") ? "href" : "none";
	var allsuspects = document.getElementsByTagName(targetelement);
	//遍历元素， 并删除匹配的元素 
	for(var i = allsuspects.length; i >= 0; i--) {
		if(allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1)
			allsuspects[i].parentNode.removeChild(allsuspects[i]);
	}
}

function checkloadjscssfile(filename, filetype) {
	if(filesadded.indexOf("[" + filename + "]") == -1) {
		loadjscssfile(filename, filetype);
		//把 [filename] 存入 filesadded 
		filesadded += "[" + filename + "]";
	} else {
		//alert("file already added!"); 
	}
}

function loadjscssfile(filename, filetype) {
	//如果文件类型为 .js ,则创建 script 标签，并设置相应属性 
	if(filetype == "js") {
		var fileref = document.createElement('script');
		fileref.setAttribute("type", "text/javascript");
		fileref.setAttribute("src", filename);
	}
	//如果文件类型为 .css ,则创建 script 标签，并设置相应属性 
	else if(filetype == "css") {
		var fileref = document.createElement("link");
		fileref.setAttribute("rel", "stylesheet");
		fileref.setAttribute("type", "text/css");
		fileref.setAttribute("href", filename);
	}
	if(typeof fileref != "undefined")
		document.getElementsByTagName("head")[0].appendChild(fileref);
}