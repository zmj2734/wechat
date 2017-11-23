//获取相机
function getImage(cutWith, cutHeight,id, storeDir, callback) {
	var c = plus.camera.getCamera();
	c.captureImage(function(e) {
		plus.io.resolveLocalFileSystemURL(e, function(entry) {
			var s = entry.toLocalURL() + "?version=" + new Date().getTime();
			uploadImage(s, cutWith, cutHeight,id, storeDir, callback);
		}, function(e) {
			console.log("读取拍照文件错误：" + e.message);
		});
	}, function(s) {
		console.log("error" + s);
	}, {
		filename: "_doc/temp.jpeg"
	})
}

//本地相册选择
function galleryImg(cutWith, cutHeight,id,storeDir, callback) {
	plus.gallery.pick(function(a) {
		plus.io.resolveLocalFileSystemURL(a, function(entry) {
			plus.io.resolveLocalFileSystemURL("_doc/", function(root) {
				root.getFile("head.png", {}, function(file) {
					//文件已存在
					file.remove(function() {
						console.log("file remove success");
						entry.copyTo(root, 'head.png', function(e) {
								var e = e.fullPath + "?version=" + new Date().getTime();
								uploadImage(e, cutWith, cutHeight,id, storeDir, callback);
							},
							function(e) {
								console.log('copy image fail:' + e.message);
							});
					}, function() {
						console.log("delete image fail:" + e.message);
					});
				}, function() {
					//文件不存在
					entry.copyTo(root, 'head.png', function(e) {
							var path = e.fullPath + "?version=" + new Date().getTime();
							uploadImage(path, cutWith, cutHeight,id, storeDir, callback); /*上传图片*/
						},
						function(e) {
							console.log('copy image fail:' + e.message);
						});
				});
			}, function(e) {
				console.log("get _www folder fail");
			})
		}, function(e) {
			console.log("读取拍照文件错误：" + e.message);
		});
	}, function(a) {}, {
		filter: "image"
	})
};

//异步上传
function uploadImage(imgPath, cutWith, cutHeight,id, storeDir, callback) {
	plus.nativeUI.showWaiting("正在努力上传中...");
	var img = document.createElement("img");
	console.log(imgPath);
	var canvas = document.createElement("canvas");
	img.src = imgPath;
	img.onload = function() {
		//获取照片扩展信息
		EXIF.getData(img, function() {
			EXIF.getAllTags(this);
			Orientation = EXIF.getTag(this, 'Orientation');
			console.log("Orientation=" + Orientation);
			if(navigator.userAgent.match(/iphone/i)) {
				switch(Orientation) {
					case 6: //需要顺时针（向左）90度旋转  
						//alert('需要顺时针（向左）90度旋转');
						rotateImg(this, 'left', canvas, cutWith, cutHeight);
						break;
					case 8: //需要逆时针（向右）90度旋转  
						//alert('需要顺时针（向右）90度旋转');
						rotateImg(this, 'right', canvas, cutWith, cutHeight);
						break;
					case 3: //需要180度旋转  
						//alert('需要180度旋转');
						rotateImg(this, 'right', canvas, cutWith, cutHeight); //转两次  
						rotateImg(this, 'right', canvas, cutWith, cutHeight);
						break;
					default:
						createCanvasImg(this, canvas, cutWith, cutHeight);
						break;
				}
			} else {
				// 实际高度或宽度
				var expectWidth = this.naturalWidth;
				var expectHeight = this.naturalHeight;
				if(this.naturalWidth > this.naturalHeight && this.naturalWidth > cutWith) {
					expectWidth = cutWith;
					expectHeight = expectWidth * this.naturalHeight / this.naturalWidth;
				} else if(this.naturalHeight > this.naturalWidth && this.naturalHeight > cutHeight) {
					expectHeight = cutHeight;
					expectWidth = expectHeight * this.naturalWidth / this.naturalHeight;
				}
				createCanvasImg(this, canvas, expectWidth, expectHeight);
			}

			var base64Data = canvas.toDataURL("image/jpeg", 0.8);
			base64Data = base64Data.replace("data:image/jpeg;base64,", "");
			/*在这里调用上传接口*/
			mui.ajax(booking.constants.api_domain, {
				data: {
					OPERATE_TYPE: "10013",
					NAME: storeDir,
					IMAGE: base64Data
				},
				dataType: 'json',
				type: 'post',
				timeout: 30000,
				success: function(data) {
					plus.nativeUI.closeWaiting();
					console.log(JSON.stringify(data));
					if(data.RESULTCODE == 0) {
						if(callback) {
							callback(data,id);
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
		});
	}
}

/**
 * 无需旋转 时调用
 * @param {Object} img
 * @param {Object} canvas
 * @param {Object} width
 * @param {Object} height
 */
function createCanvasImg(img, canvas, width, height) {
	var ctx = canvas.getContext('2d');
	canvas.width = width;
	canvas.height = height;
	ctx.drawImage(img, 0, 0, width, height);
}
//对图片旋转处理 added by lzk  
function rotateImg(img, direction, canvas, cutWith, cutHeight) {
	//alert(img);  
	//最小与最大旋转方向，图片旋转4次后回到原方向    
	var min_step = 0;
	var max_step = 3;
	//var img = document.getElementById(pid);    
	if(img == null) return;
	//img的高度和宽度不能在img元素隐藏后获取，否则会出错    
	var height = img.height;
	var width = img.width;
	/*if(width > height) {
		if(width > cutWith) {
			height = Math.round(height *= cutWith / width);
			width = cutWith;
		}
	} else {
		if(height > cutHeight) {
			width = Math.round(width *= cutHeight / height);
			height = cutHeight;
		}
	}*/

	var scale = width / height;
	width1 = cutWith;
	height1 = parseInt(width1 / scale);
	height = height1;
	width = width1;

	//alert(height*width);

	//var step = img.getAttribute('step');    
	var step = 2;
	if(step == null) {
		step = min_step;
	}
	if(direction == 'right') {
		step++;
		//旋转到原位置，即超过最大值    
		step > max_step && (step = min_step);
	} else {
		step--;
		step < min_step && (step = max_step);
	}
	//旋转角度以弧度值为参数    
	var degree = step * 90 * Math.PI / 180;
	var ctx = canvas.getContext('2d');
	switch(step) {
		case 0:
			canvas.width = width;
			canvas.height = height;
			ctx.drawImage(img, 0, 0, width, height);
			break;
		case 1:
			canvas.width = height;
			canvas.height = width;
			ctx.rotate(degree);
			ctx.drawImage(img, 0, -height, width, height);
			break;
		case 2:
			canvas.width = width;
			canvas.height = height;
			ctx.rotate(degree);
			ctx.drawImage(img, -width, -height, width, height);
			break;
		case 3:
			canvas.width = height;
			canvas.height = width;
			ctx.rotate(degree);
			ctx.drawImage(img, -width, 0, width, height);
			break;
	}
}