  /*
   * 微信js
   * 注意：
   * 1. 所有的JS接口只能在公众号绑定的域名下调用，公众号开发者需要先登录微信公众平台进入“公众号设置”的“功能设置”里填写“JS接口安全域名”。
   * 2. 如果发现在 Android 不能分享自定义内容，请到官网下载最新的包覆盖安装，Android 自定义分享接口需升级至 6.0.2.58 版本及以上。
   * 3. 常见问题及完整 JS-SDK 文档地址：http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html
   *
   * 开发中遇到问题详见文档“附录5-常见错误及解决办法”解决，如仍未能解决可通过以下渠道反馈：
   * 邮箱地址：weixin-open@qq.com
   * 邮件主题：【微信JS-SDK反馈】具体问题
   * 邮件内容说明：用简明的语言描述问题所在，并交代清楚遇到该问题的场景，可附上截屏图片，微信团队会尽快处理你的反馈。
   */
	$.ajax({
		url : wechat.baseUrl + "/wx/getJsapiTicket",
		data : {
			url : window.location.href.split("#")[0] ,
			jsApiList: 
		    	'checkJsApi,onMenuShareTimeline,onMenuShareAppMessage,onMenuShareQQ,onMenuShareQZone,hideAllNonBaseMenuItem,showAllNonBaseMenuItem,chooseImage,previewImage,uploadImage,downloadImage,getNetworkType,openLocation,getLocation,closeWindow,scanQRCode,chooseWXPay'
		},
		type : "get",
		DataType : "json",
		async: false ,
		success : function(data) {
			if(data.RESULTCODE == 0){
				var noncestr = randomString(20) ;
				var timestamp = new Date().getTime() ;
				var url = window.location.href.split("#")[0] ;
				var temp = "jsapi_ticket="+data.RESULTLIST+"&noncestr="+noncestr+"&timestamp="+timestamp+"&url="+url;
				console.log(temp) ;
				var signature = sha1(temp) ;
				wx.config({
				      debug: false,
				      appId: wechat.AppId,
				      timestamp: timestamp ,
				      nonceStr: noncestr ,
				      signature: signature,
				      jsApiList: [
				    	  'checkJsApi',
				    	  'onMenuShareTimeline',
				    	  'onMenuShareAppMessage',
				    	  'hideAllNonBaseMenuItem',
				    	  'showAllNonBaseMenuItem',
				    	  'chooseImage',
				    	  'previewImage',
				    	  'uploadImage',
				    	  'downloadImage',
				    	  'getNetworkType',
				    	  'openLocation',
				    	  'getLocation',
				    	  'closeWindow',
				    	  'scanQRCode',
				    	  'chooseWXPay'
				      ]
				 }) ;
			}
		}
	})

wx.ready(function () {
    // 1 判断当前版本是否支持指定 JS 接口，支持批量判断
    // document.querySelector('#checkJsApi').onclick = function () {
    //     wx.checkJsApi({
    //         jsApiList: [
    //             'getNetworkType',
    //             'previewImage'
    //         ],
    //         success: function (res) {
    //             alert(JSON.stringify(res));
    //         }
    //     });
    // }
})
//   // 2. 分享接口
//   // 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
//   document.querySelector('#onMenuShareAppMessage').onclick = function () {
//     wx.onMenuShareAppMessage({
//       title: '互联网之子',
//       desc: '在长大的过程中，我才慢慢发现，我身边的所有事，别人跟我说的所有事，那些所谓本来如此，注定如此的事，它们其实没有非得如此，事情是可以改变的。更重要的是，有些事既然错了，那就该做出改变。',
//       link: 'http://movie.douban.com/subject/25785114/',
//       imgUrl: 'http://demo.open.weixin.qq.com/jssdk/images/p2166127561.jpg',
//       trigger: function (res) {
//         // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
//         alert('用户点击发送给朋友');
//       },
//       success: function (res) {
//         alert('已分享');
//       },
//       cancel: function (res) {
//         alert('已取消');
//       },
//       fail: function (res) {
//         alert(JSON.stringify(res));
//       }
//     });
//     alert('已注册获取“发送给朋友”状态事件');
//   };
//
//   // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
//   document.querySelector('#onMenuShareTimeline').onclick = function () {
//     wx.onMenuShareTimeline({
//       title: '互联网之子',
//       link: 'http://movie.douban.com/subject/25785114/',
//       imgUrl: 'http://demo.open.weixin.qq.com/jssdk/images/p2166127561.jpg',
//       trigger: function (res) {
//         // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
//         alert('用户点击分享到朋友圈');
//       },
//       success: function (res) {
//         alert('已分享');
//       },
//       cancel: function (res) {
//         alert('已取消');
//       },
//       fail: function (res) {
//         alert(JSON.stringify(res));
//       }
//     });
//     alert('已注册获取“分享到朋友圈”状态事件');
//   };
//
//   // 2.3 监听“分享到QQ”按钮点击、自定义分享内容及分享结果接口
//   document.querySelector('#onMenuShareQQ').onclick = function () {
//     wx.onMenuShareQQ({
//       title: '互联网之子',
//       desc: '在长大的过程中，我才慢慢发现，我身边的所有事，别人跟我说的所有事，那些所谓本来如此，注定如此的事，它们其实没有非得如此，事情是可以改变的。更重要的是，有些事既然错了，那就该做出改变。',
//       link: 'http://movie.douban.com/subject/25785114/',
//       imgUrl: 'http://img3.douban.com/view/movie_poster_cover/spst/public/p2166127561.jpg',
//       trigger: function (res) {
//         alert('用户点击分享到QQ');
//       },
//       complete: function (res) {
//         alert(JSON.stringify(res));
//       },
//       success: function (res) {
//         alert('已分享');
//       },
//       cancel: function (res) {
//         alert('已取消');
//       },
//       fail: function (res) {
//         alert(JSON.stringify(res));
//       }
//     });
//     alert('已注册获取“分享到 QQ”状态事件');
//   };
//
//
//
//   // 2.5 监听“分享到QZone”按钮点击、自定义分享内容及分享接口
//   document.querySelector('#onMenuShareQZone').onclick = function () {
//     wx.onMenuShareQZone({
//       title: '互联网之子',
//       desc: '在长大的过程中，我才慢慢发现，我身边的所有事，别人跟我说的所有事，那些所谓本来如此，注定如此的事，它们其实没有非得如此，事情是可以改变的。更重要的是，有些事既然错了，那就该做出改变。',
//       link: 'http://movie.douban.com/subject/25785114/',
//       imgUrl: 'http://img3.douban.com/view/movie_poster_cover/spst/public/p2166127561.jpg',
//       trigger: function (res) {
//         alert('用户点击分享到QZone');
//       },
//       complete: function (res) {
//         alert(JSON.stringify(res));
//       },
//       success: function (res) {
//         alert('已分享');
//       },
//       cancel: function (res) {
//         alert('已取消');
//       },
//       fail: function (res) {
//         alert(JSON.stringify(res));
//       }
//     });
//     alert('已注册获取“分享到QZone”状态事件');
//   };
//
//
//
//
//
//
//
//
//
//
//
//   // 5 图片接口
//   // 5.1 拍照、本地选图
//   var images = {
//     localId: [],
//     serverId: []
//   };
//   document.querySelector('#chooseImage').onclick = function () {
//     wx.chooseImage({
//       success: function (res) {
//         images.localId = res.localIds;
//         alert('已选择 ' + res.localIds.length + ' 张图片');
//       }
//     });
//   };
//
//   // 5.2 图片预览
//   document.querySelector('#previewImage').onclick = function () {
//     wx.previewImage({
//       current: 'http://img5.douban.com/view/photo/photo/public/p1353993776.jpg',
//       urls: [
//         'http://img3.douban.com/view/photo/photo/public/p2152117150.jpg',
//         'http://img5.douban.com/view/photo/photo/public/p1353993776.jpg',
//         'http://img3.douban.com/view/photo/photo/public/p2152134700.jpg'
//       ]
//     });
//   };
//
//   // 5.3 上传图片
//   document.querySelector('#uploadImage').onclick = function () {
//     if (images.localId.length == 0) {
//       alert('请先使用 chooseImage 接口选择图片');
//       return;
//     }
//     var i = 0, length = images.localId.length;
//     images.serverId = [];
//     function upload() {
//       wx.uploadImage({
//         localId: images.localId[i],
//         success: function (res) {
//           i++;
//           // alert('已上传：' + i + '/' + length);
//           images.serverId.push(res.serverId);
//           if (i < length) {
//             upload();
//           }
//         },
//         fail: function (res) {
//           alert(JSON.stringify(res));
//         }
//       });
//     }
//     upload();
//   };
//
//   // 5.4 下载图片
//   document.querySelector('#downloadImage').onclick = function () {
//     if (images.serverId.length === 0) {
//       alert('请先使用 uploadImage 上传图片');
//       return;
//     }
//     var i = 0, length = images.serverId.length;
//     images.localId = [];
//     function download() {
//       wx.downloadImage({
//         serverId: images.serverId[i],
//         success: function (res) {
//           i++;
//           alert('已下载：' + i + '/' + length);
//           images.localId.push(res.localId);
//           if (i < length) {
//             download();
//           }
//         }
//       });
//     }
//     download();
//   };
//
//   // 6 设备信息接口
//   // 6.1 获取当前网络状态
//   document.querySelector('#getNetworkType').onclick = function () {
//     wx.getNetworkType({
//       success: function (res) {
//         alert(res.networkType);
//       },
//       fail: function (res) {
//         alert(JSON.stringify(res));
//       }
//     });
//   };
//
//   // 7 地理位置接口
//   // 7.1 查看地理位置
//   document.querySelector('#openLocation').onclick = function () {
//     wx.openLocation({
//       latitude: 23.099994,
//       longitude: 113.324520,
//       name: 'TIT 创意园',
//       address: '广州市海珠区新港中路 397 号',
//       scale: 14,
//       infoUrl: 'http://weixin.qq.com'
//     });
//   };
//
//   // 7.2 获取当前地理位置
//   document.querySelector('#getLocation').onclick = function () {

//   };
//
//   // 8 界面操作接口
//
//
//   // 8.5 隐藏所有非基本菜单项
//   document.querySelector('#hideAllNonBaseMenuItem').onclick = function () {
//     wx.hideAllNonBaseMenuItem({
//       success: function () {
//         alert('已隐藏所有非基本菜单项');
//       }
//     });
//   };
//
//   // 8.6 显示所有被隐藏的非基本菜单项
//   document.querySelector('#showAllNonBaseMenuItem').onclick = function () {
//     wx.showAllNonBaseMenuItem({
//       success: function () {
//         alert('已显示所有非基本菜单项');
//       }
//     });
//   };
//
//   // 8.7 关闭当前窗口
//   document.querySelector('#closeWindow').onclick = function () {
//     wx.closeWindow();
//   };
//
//   // 9 微信原生接口
//   // 9.1.1 扫描二维码并返回结果
//   document.querySelector('#scanQRCode0').onclick = function () {
//     wx.scanQRCode();
//   };
//   // 9.1.2 扫描二维码并返回结果
//   document.querySelector('#scanQRCode1').onclick = function () {
//     wx.scanQRCode({
//       needResult: 1,
//       desc: 'scanQRCode desc',
//       success: function (res) {
//         alert(JSON.stringify(res));
//       }
//     });
//   };
//
//   // 10 微信支付接口
//   // 10.1 发起一个支付请求
//   document.querySelector('#chooseWXPay').onclick = function () {
//     // 注意：此 Demo 使用 2.7 版本支付接口实现，建议使用此接口时参考微信支付相关最新文档。
//     wx.chooseWXPay({
//       timestamp: 1414723227,
//       nonceStr: 'noncestr',
//       package: 'addition=action_id%3dgaby1234%26limit_pay%3d&bank_type=WX&body=innertest&fee_type=1&input_charset=GBK&notify_url=http%3A%2F%2F120.204.206.246%2Fcgi-bin%2Fmmsupport-bin%2Fnotifypay&out_trade_no=1414723227818375338&partner=1900000109&spbill_create_ip=127.0.0.1&total_fee=1&sign=432B647FE95C7BF73BCD177CEECBEF8D',
//       signType: 'SHA1', // 注意：新版支付接口使用 MD5 加密
//       paySign: 'bd5b1933cda6e9548862944836a9b52e8c9a2b69'
//     });
//   };
//
//
//
//   var shareData = {
//     title: '微信JS-SDK Demo',
//     desc: '微信JS-SDK,帮助第三方为用户提供更优质的移动web服务',
//     link: 'http://demo.open.weixin.qq.com/jssdk/',
//     imgUrl: 'http://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRt8Qia4lv7k3M9J1SKqKCImxJCt7j9rHYicKDI45jRPBxdzdyREWnk0ia0N5TMnMfth7SdxtzMvVgXg/0'
//   };
//   wx.onMenuShareAppMessage(shareData);
//   wx.onMenuShareTimeline(shareData);
//
//   function decryptCode(code, callback) {
//     $.getJSON('/jssdk/decrypt_code.php?code=' + encodeURI(code), function (res) {
//       if (res.errcode == 0) {
//         codes.push(res.code);
//       }
//     });
//   }
// });
//
// wx.error(function (res) {
//   alert(res.errMsg);
// });
//


