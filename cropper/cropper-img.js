var Cro =  {
	orientation: null,
		
		urldata: null,
		view: null,
		num: 0,
		sbx: null,
		sby: null,
		n: 0,
		onReady: function(path) {
			var that = this;
			that.bindEvent();
			//that.view = plus.webview.currentWebview();
			var url = path;
			console.log(path);
			var img = document.getElementById("im");
			
			img.setAttribute("src", url);
			
			img.addEventListener("load", function() {
			
				EXIF.getData(img, function() {
					
					var orientation = EXIF.getAllTags(this).Orientation;
					
					var urlStr =that.loadcopyImg(img, orientation);
				
					
					$("#im").attr("src", urlStr);
					
					that.cropperImg();
				});
			})
		},
		cropperImg: function() {
			var that = this;
			$('#im').cropper({
				aspectRatio: 1 / 1,
				autoCropArea: 1,
				strict: true,
				background: false,
				guides: true,
				highlight: true,
				dragCrop: true,
				movable: true,
				resizable: true,
				crop: function(data) {
					console.log(22222)
					that.urldata = that.base64(data);
				}
			});
		},
		loadcopyImg: function(img, opt) {
			var that = this;
			
			var canvas = document.createElement("canvas");
			var square = 500;
			var imageWidth, imageHeight;
			if (img.width > img.height) {
				imageHeight = square;
				imageWidth = Math.round(square * img.width / img.height);
			} else {
				imageHeight = square; //this.width;
				imageWidth = Math.round(square * img.width / img.height);
			}
			canvas.height = imageHeight;
			canvas.width = imageWidth;
			if (opt == 6) {
				that.num = 90;
			} else if (opt == 3) {
				that.num = 180;
			} else if (opt == 8) {
				that.num = 270;
			}
			if (that.num == 360) {
				that.num = 0;
			}

			var ctx = canvas.getContext("2d");
			ctx.translate(imageWidth / 2, imageHeight / 2);
			ctx.rotate(that.num * Math.PI / 180);
			ctx.translate(-imageWidth / 2, -imageHeight / 2);
			ctx.drawImage(img, 0, 0, imageWidth, imageHeight);
			//document.getElementById("test").appendChild(canvas);
			var dataURL = canvas.toDataURL("image/jpeg", 1);
			//ctx.clearRect(0,0,canvas.width,canvas.height);  
			return dataURL;
		},
		bindEvent: function() {
			var that =this;
			document.getElementById("quxiao").addEventListener("click", function() {
				$("#plcther").hide();
			});
			document.getElementById("xuanqu").addEventListener("click", function() {
				that.showFace(that.urldata);
			});
		},
		base64: function(data) {
			var that = this;
			var img = document.getElementById("im");
			var canvas = document.createElement("canvas");
			canvas.height = 200;
			canvas.width = 200;

			var bx = data.x;
			var by = data.y;

			var ctx = canvas.getContext("2d");
			ctx.drawImage(img, bx, by, data.width, data.height, 0, 0, 200, 200);
			var dataURL = canvas.toDataURL("image/jpeg", 0.5);
			ctx.clearRect(0,0,canvas.width,canvas.height);  
			return dataURL;
		},
		getdata: function() {
					console.log("66666")
			var view1 = plus.webview.getWebviewById("modifyInfo.html");
			mui.fire(view1, 'headimg', {});
			window.cro.view.close();
		},
		showFace: function(str) {
			str = str.replace("data:image/jpeg;base64,", "");
			str = str.replace("data:image/png;base64,", ""); //三星手机剪裁后的图片格式为png
			uploadImages(str,uploadSucess);
		}
}
	



function uploadImages(base64Data,uploadSucess){
	mui.ajax(booking.constants.api_domain, {
		data: {
			OPERATE_TYPE: "10013",
			NAME: "sphotos",
			IMAGE: base64Data
		},
		dataType: 'json',
		type: 'post',
		timeout: 30000,
		success: function(data) {
			plus.nativeUI.closeWaiting();
			console.log(JSON.stringify(data));
			if(data.RESULTCODE == 0) {
				if(uploadSucess) {
					uploadSucess(data);
				}
				mui.toast('上传成功！');
			} else {
				mui.toast("上传失败！");
			}
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
			mui.toast('网络异常，请稍后再试！');
		}
	});
}