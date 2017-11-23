var win = null;
var typearray = new Array();
var auid = localStorage.getItem("auid");
var userPicker = null;
var shop_city = null;
var apply_id = null;
$(function() {
    initPhotoSwipeFromDOM('.photo');

    mui.app_request('POST', {
        'OPERATE_TYPE': '20014',
        'AUTH_ID': auid,

    }, function(data) {
        if(data.RESULTCODE == '0') {
            console.log(JSON.stringify(data));
            var info = data.RESULTLIST;
            apply_id = info.id;
            //商铺名称
            document.getElementById("shop_name").value = info.shop_name;
            document.getElementById('shop_type').setAttribute("shopId", info.shop_category_id);
            document.getElementById("shop_type").innerHTML = info.shop_category_id_name;
            document.getElementById('phonenum').value = info.phone_num;
            if(mui.isnull(times)){
                var times = info.shop_hours.split("-");
                document.getElementById("starTime").value = times[0];
                document.getElementById("endTime").value = times[1];
            }
            document.getElementById("shop_city").setAttribute("data-id", info.district_id);
            document.getElementById("shop_city").value = info.district_name;
            document.getElementById('shop_add').value = info.addr;
            document.getElementById("trading_area").value = info.trading_area;
            document.getElementById("consumption").value = info.consumption;
            document.getElementById("img_shop_logo_up_imgs").value = info.shop_title_url;
            $("#shop_logo_up_imgs").find("img").attr("src", booking.constants.ip+info.shop_title_url);
            document.getElementById('shop_content').value = info.des;
            document.getElementById('content_shop').value = info.brief_introduction;
            if(info.state == -1){
                $("#errorValue").html(data.refuse);
                $("#errorReport").show();
            }

            //$("#errorReport").show();
            var html = '';
            var urls = info.shop_logo_url;
            var url_last = urls.substr(urls.length-1,1);
            if(url_last==";"){
                urls = urls.substr(0,urls.length-1);
            }
            if(info.shop_logo_url.indexOf(";") != -1) {

                urls = urls.split(";");
                for(var i = 0; i < urls.length; i++) {
                    html += '<figure>\
									<a href="' + booking.constants.ip + urls[i] + '" data-size="800x800">\
										<img src="' + booking.constants.ip + urls[i] + '" />\
										<span class="close-img"></span>\
									</a>\
								</figure> '
                }
            } else {
                html = '<figure>\
								<a href="' + booking.constants.ip + info.shop_logo_url + '" data-size="800x800">\
									<img src="' + booking.constants.ip + info.shop_logo_url + '" />\
									<span class="close-img"></span>\
								</a>\
							</figure> '
            }
            $("#photo").html(html)
            var figure = $("#photo").find("figure");
            if(figure.length >= 5) {
                $("#up_img").hide()
            }
            for(var i = 2; i < figure.length; i = i + 3) {
                figure.eq(i).css("margin-right", "0")
            }

        }

    }, function(result) {
        if(result.RESULTCODE == "-1") {
            mui.toast(result.DESCRIPTION);
            remDisabled("requerd");
            return;
        }
        remDisabled("requerd");
        mui.toast("当前网络不给力");
        return;
    });
    document.getElementById("quxiao").addEventListener("tap", function() {
        $("#myimgs").hide();
    })

    $("#shop_city_addr").on("click", function() {
        $("#shop_city").selectAddress({
            "ajaxURL": booking.constants.api_domain,
            storageBox: $("#shop_city"),
            callback: function(string, id) {
                //执行回调
                console.log(string + id)
                var city_id = id;
                if(city_id) {
                    shop_city = city_id;
                    $("#shop_city").val(string);
                    $("#shop_city").attr("data-id", id);
                }
            }
        });
    });

    mui.app_request('POST', {
            'OPERATE_TYPE': '10010'
        }, function(data) {
            if(data.RESULTCODE == '0') {
                var typelist = data.RESULTLIST.result;
                for(var i = 0; i < typelist.length; i++) {
                    var id = typelist[i].id;
                    var name = typelist[i].category_name;
                    typearray.push({
                        "value": id,
                        "text": name
                    });
                }
                userPicker = new mui.PopPicker();
                userPicker.setData(typearray);
                var showUserPickerButton = document.getElementById('shop_type_click');
                var userResult = document.getElementById('shop_type');
                showUserPickerButton.addEventListener('tap', function(event) {
                    $("input").blur();
                    userPicker.show(function(items) {
                        userResult.innerHTML = items[0].text;
                        userResult.setAttribute("shopId", items[0].value);

                        //返回 false 可以阻止选择框的关闭
                        //return false;
                    });
                }, false);
            }
        },
        function(result) {
            if(result.RESULTCODE == '-1') {
                mui.toast(result.DESCRIPTION);
            }
        });

    document.getElementById('requerd').addEventListener('tap', function() {
        //商铺名称
        var shop_name = document.getElementById("shop_name").value;
        //种类id
        var shopId = document.getElementById('shop_type').getAttribute("shopId");
        //联系电话
        var phonenum = document.getElementById('phonenum').value;
        //营业时间
        var time = '';
        var time1 = document.getElementById("starTime").value;
        var time2 = document.getElementById("endTime").value;
        time = time1 + '-' + time2
        //区县
        var shop_city = document.getElementById("shop_city").getAttribute("data-id");

        //详细地址
        var shopadd = document.getElementById('shop_add').value;

        //商圈位置
        var trading_area = document.getElementById("trading_area").value;

        //人均消费
        var consumption = document.getElementById("consumption").value;

        //店铺logo
        var img_shop_logo_up_imgs = document.getElementById("img_shop_logo_up_imgs").value;

        var figure = $("#photo").find("figure");
        var urls = '';
        for(var i = 0; i < figure.length; i++) {
            var rl = figure.eq(i).children("a").attr("href");
            if(rl.indexOf(booking.constants.ip) != -1) {
                rl = rl.substr(booking.constants.ip.length, rl.length - booking.constants.ip.length);
            }
            urls += rl + ';'
        }

        //商铺简介
        var content_shop = document.getElementById('content_shop').value;

        var shop_content = document.getElementById('shop_content').value;
        if(mui.isnull(shop_name)) {
            mui.toast('店铺名不能为空');
            return;
        }else if(shop_name.length>10){
            mui.toast("商铺名不能超过10位数。")
            return;
        }

        if(mui.isnull(shopId)) {
            mui.toast('经营品类不能为空!');
            return;
        }
        var p = /^((0\d{2,3}-\d{7,8})|(1[35847]\d{9}))$/;

        if(mui.isnull(phonenum)) {
            mui.toast('联系电话不能为空!');
            return;
        } else if(!p.test(phonenum)) {
            mui.toast('请输入正确的电话号码!')
            return;
        }

        if(time1 == "00:00" && time2 == "00:00") {
            mui.toast('请选择营业时间!')
            return;
        }
        if(mui.isnull(shop_city)) {
            mui.toast('请选择所在地区');
            return;
        }

        if(mui.isnull(shopadd)) {
            mui.toast('商铺详细地址不能为空!');
            return;
        }
        var d = /^[1-9]*[1-9][0-9]*$/;
        if(mui.isnull(consumption)) {
            mui.toast("请设置人均消费");
            return;
        } else if(!d.test(consumption)) {
            mui.toast("请输入正整数");
            return;
        }
        //
        //				//商家图片
        urls = urls.substring(0, urls.length - 1)
        if(mui.isnull(img_shop_logo_up_imgs)) {
            if(!mui.isnull(urls)) {
                img_shop_logo_up_imgs = urls.split(";")[0];
            } else {
                mui.toast("请设置店铺展示图");
                return;
            }
        }

        if(mui.isnull(content_shop)) {
            mui.toast("请填写商户简介");
            return;
        }

        var params = {
            'OPERATE_TYPE': '20015',
            "AUTH_ID": auid,
            "APPLY_ID":apply_id,
            'SHOP_NAME': shop_name, //商铺名称
            'SHOP_CATEGORY_ID': shopId, //行业编号
            'PHONE_NUM': phonenum, //联系人电话
            "SHOP_HOURS": time,
            'DISTRICT_ID': shop_city, //区县
            'ADDR': shopadd, //商铺详细地址
            "TRADING_AREA": trading_area, //商圈
            "CONSUMPTION": consumption, //人均消费
            'DES': shop_content , //商铺简介
            "SHOP_TITLE_URL": img_shop_logo_up_imgs, //商家logo
            "SHOP_LOGO_URL": urls,
            "BRIEF_INTRODUCTION": content_shop, //商家简介
        }
        mui.app_request('POST', params, function(data) {
                if(data.RESULTCODE == '0') {
                    mui.toast("提交成功");
                    booking.closeAndOpenNewWindow("mine.html","mine");
                }
            },
            function(result) {
                if(result.RESULTCODE == '-1') {
                    mui.toast(result.DESCRIPTION);
                }
            });

    });

    document.getElementById('up_img').addEventListener('tap', function() {
        var figure = $("#photo").find("figure");
        if(figure.length >= 5) {
            mui.toast("最多上传5张店铺照片");

            return;
        }
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
                        getImages("up_img")
                        //	getImage(1000, 800, "up_img", "sphotos", uploadSuc); /*拍照*/
                        break;
                    case 2:
                        galleryImgs("up_img")
                        //galleryImgs(1000, 800, "up_img", "sphotos", uploadSuc); /*打开相册*/
                        break;
                    default:
                        break;
                }
            });
        }
    }, false);

    document.getElementById('shop_logo_up_imgs').addEventListener('tap', function() {

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
                        getImages("shop_logo_up_imgs")
                        //getImage(1000, 800, "shop_logo_up_imgs", "sphotos", uploadSucess); /*拍照*/
                        break;
                    case 2:
                        galleryImgs("shop_logo_up_imgs")
                        //galleryImg(1000, 800, "shop_logo_up_imgs", "sphotos", uploadSucess); /*打开相册*/
                        break;
                    default:
                        break;
                }
            });
        }
    }, false);

});

function uploadSuc(data, id) {
    var html = '';
    html = '<figure>\
						<a href="' + booking.constants.ip + data.RESULTLIST.PATH + '" data-size="800x800">\
						<img src="' + booking.constants.ip + data.RESULTLIST.PATH + '" />\
						<span class="close-img"></span></a>\
					</figure>'
    $("#photo").append(html);
    var figure = $("#photo").find("figure");
    if(figure.length >= 5) {
        $("#up_img").hide()
    }
    for(var i = 2; i < figure.length; i = i + 3) {
        figure.eq(i).css("margin-right", "0")
    }
}

function uploadSucesss(data, id) {
    //alert("0"+id)
    $("#img_" + id).val(data.RESULTLIST.PATH);
    var idorhandurl = booking.constants.ip + data.RESULTLIST.PATH;
    console.log(idorhandurl);
    $("#shop_logo_imgs").attr("src", idorhandurl);
    //document.getElementById(id).src = idorhandurl;
}

function getImages(id){
    var cmr = plus.camera.getCamera();
    cmr.captureImage(function(p) {
        plus.io.resolveLocalFileSystemURL(p, function(entry) {
            var path = "file:///" + entry.fullPath;
            //$("#plcther").show();
            myCropper(id,path)
        }, function(e) {
            mui.toast(e.message);
        });
    }, function(e) {}, {
        filename: "_doc/camera/"
    });
}
function galleryImgs(id){
    plus.gallery.pick(function(url) {
        var path = url;
        console.log(path)
        myCropper(id,path)
    }, function(error) {
        mui.toast("打开相册失败");
    });
}

function uploadImagesssss(id,base64Data){
    //alert("2"+id);
    var app_type;
    if(mui.os.ios) {
        app_type = 'ios'
    }else{
        app_type = "android"
    }
    var timestamp = Date.parse(new Date());
    var interface_version = '2.0'
    var opreate_type = "10013";
    var sign = interface_version + app_type + timestamp + opreate_type;
    sign = Encrypt(sign);
    console.log(sign)
    mui.ajax(booking.constants.api_domain, {
        data: {
            OPERATE_TYPE: "10013",
            NAME: "sphotos",
            IMAGE: base64Data,
            "app_type": app_type,
            "timestamp": timestamp,
            "interface_version": interface_version,
            "sign": sign.toString()
        },
        dataType: 'json',
        type: 'post',
        timeout: 30000,
        success: function(data) {
            plus.nativeUI.closeWaiting();
            console.log("000"+JSON.stringify(data));
            if(data.RESULTCODE == 0) {
                $("#myimgs").hide();
                if(id=="shop_logo_up_imgs"){
                    uploadSucesss(data, id)
                }else if(id=="up_img"){
                    uploadSuc(data, id)
                }
                $("#baocun").attr("disabled",false)
                mui.toast('上传成功！');
            } else {
                mui.toast(data.DESCRIPTION);
            }
        },
        error: function(xhr, type, errorThrown) {
            plus.nativeUI.closeWaiting();
            mui.toast('网络异常，请稍后再试！');
        }
    });
}

function uploadSucess(data) {
    var win = plus.webview.currentWebview();
    var backId = win.backId;
    var auid =localStorage.getItem("auid");
    head_img = booking.constants.ip + data.RESULTLIST.PATH;
    mui.app_request('POST', {
        "OPERATE_TYPE": "10009",
        "AUTH_ID": auid,
        "HEADER_IMG": data.RESULTLIST.PATH
    }, function(data) {
        if(data.RESULTCODE == "0") {
            $("#plcther").hide();
            //window.location.reload()
            document.getElementById('big_img').src = head_img;
        }
    }, function(result) {
        mui.toast(result.DESCRIPTION);
    });
}
function myCropper(id,path){
    $("#myimgsss").attr("src",path);
    $("#myimgs").show();
    var $image = $('#myimgsss'),
        $dataX = $('#dataX'),
        $dataY = $('#dataY'),
        $dataHeight = $('#dataHeight'),
        $dataWidth = $('#dataWidth'),
        $dataRotate = $('#dataRotate'),
        options = {
            aspectRatio: 4 / 3,
            preview: '.img-preview',
            crop: function (data) {
                $dataX.val(Math.round(data.x));
                $dataY.val(Math.round(data.y));
                $dataHeight.val(Math.round(data.height));
                $dataWidth.val(Math.round(data.width));
                $dataRotate.val(Math.round(data.rotate));
            },
            dragMode:'none',
            rotatable:false,
            autoCropArea:0.9,
            dragCrop: false,
            movable:false,
            zoomable :true,
            resizable: false,
        };
    // var cropper = new Cropper($image, options);
    $image.on({
        'build.cropper': function (e) {
            console.log(e.type);
        },
        'built.cropper': function (e) {
            console.log(e.type);
        },
        'dragstart.cropper': function (e) {
            console.log(e.type, e.dragType);
        },
        'dragmove.cropper': function (e) {
            console.log(e.type, e.dragType);
        },
        'dragend.cropper': function (e) {
            console.log(e.type, e.dragType);
        },
        'zoomin.cropper': function (e) {
            console.log(e.type);
        },
        'zoomout.cropper': function (e) {
            console.log(e.type);
        }
    }).cropper(options).cropper('reset').cropper('replace', path);

    //document.getElementById('baocun').addEventListener('tap', function() {
    $("#baocun").unbind().bind('click',  function () {
        //$("#baocun").unbind();
        $(this).attr("disabled",true)
        var data = $(this).data(),
            $target,
            result;

        if (data.method) {
            data = $.extend({}, data); // Clone a new one

            if (typeof data.target !== 'undefined') {
                $target = $(data.target);

                if (typeof data.option === 'undefined') {
                    try {
                        data.option = JSON.parse($target.val());
                    } catch (e) {
                        console.log(e.message);
                    }
                }
            }

            result = $image.cropper(data.method, data.option);
            //$image.cropper("replace",path,data.option);
            console.log("按钮22："+result.toString());
            if (data.method === 'getCroppedCanvas') {
                var dataURL = result.toDataURL("image/jpeg", 0.5);
                //dataURL = dataURL.replace("data:image/jpeg;base64,", "");
                //console.log("按钮："+dataURL);
                //$("#myimgs").hide();

                uploadImagesssss(id,dataURL)
                // $('#getCropp edCanvasModal').modal().find('.modal-body').html(result);
            }

            if ($.isPlainObject(result) && $target) {
                try {
                    $target.val(JSON.stringify(result));
                } catch (e) {
                    console.log(e.message);
                }
            }

        }
    }).on('keydown', function (e) {

        switch (e.which) {
            case 37:
                e.preventDefault();
                $image.cropper('move', -1, 0);
                break;

            case 38:
                e.preventDefault();
                $image.cropper('move', 0, -1);
                break;

            case 39:
                e.preventDefault();
                $image.cropper('move', 1, 0);
                break;

            case 40:
                e.preventDefault();
                $image.cropper('move', 0, 1);
                break;
        }

    });


    // Import image
    var $inputImage = $('#inputImage'),
        URL = window.URL || window.webkitURL,
        blobURL;
    if (URL) {
        $inputImage.change(function () {
            var files = this.files,
                file;

            if (files && files.length) {
                file = files[0];

                if (/^image\/\w+$/.test(file.type)) {
                    blobURL = URL.createObjectURL(file);
                    $image.one('built.cropper', function () {
                        URL.revokeObjectURL(blobURL); // Revoke when load complete
                    }).cropper('reset', true).cropper('replace', blobURL);
                    $inputImage.val('');
                } else {
                    showMessage('Please choose an image file.');
                }
            }
        });
    } else {
        $inputImage.parent().remove();
    }
}