 mui.init();
    var auid = localStorage.getItem("auid");

    var my_shop_info = null;
    var type = 1;
    var isReal = false;
    //var shop_id = null;
    var profit_info = null;
    var my_bz_info = null;

    $(function () {
        var app_type;
        if (mui.os.ios) {
            app_type = 'ios'
        } else {
            app_type = "android"
        }
        var timestamp = Date.parse(new Date());
        var interface_version = '2.0';
        var opreate_type = "10098";
        var sign = interface_version + app_type + timestamp + opreate_type;
        sign = Encrypt(sign);
        $.ajax({
            type: "post",
            data: data = {
                "OPERATE_TYPE": "10098",
                "BEGIN": "0",
                "SIZE": "50",
                "app_type": app_type,
                "timestamp": timestamp,
                "interface_version": interface_version,
                "sign": sign.toString()
            },
            url: booking.constants.api_domain,
            async: true,
            success: function (data) {
                if (data.RESULTCODE == "0") {
                    var infolist = data.RESULTLIST.result;
                    var info_list = '';
                    for (var i = 0; i < infolist.length; i++) {
                        info_list += '<li>' + dataUtil(infolist[i].create_time) + "&nbsp;&nbsp;" + replacePhone(infolist[i].username) + '，' + infolist[i].des + infolist[i].amount + '元</li>'
                    }
                    $("#scoll_content").append(info_list);
                    $("#my-speed").append(info_list);
                    //$("#scoll_msg").css({"height":infolist.length*50 - 1 +"px","maxheight":"149px"})
                    myScroll();
                }
            },
            error: function (result) {

            }
        });

        $(".navlist").on("click", "a", function () {
            var id = $(this).attr("id");
            var data = $(this).attr("data");
            var url = "../" + id + "/" + data + ".html";
            if (id === "index") {
                return;
            } else {
                booking.closeAndOpenNewWindow(url, id);
            }
        });

        //获取用户状态
        mui.app_request('POST', {
            "OPERATE_TYPE": "20027",
            "AUTH_ID": auid
        }, function (data) {
            if (data.RESULTCODE == "0") {
                type = data.RESULTLIST.user_type;

                if (type == 3) {
                    $("#shop_info_show").show();
                    $("#shop_bar").show();
                } else {
                    $("#index_bar").show();
                    $("#user_msg").show()
                }
            }
            return;
        }, function (result) {
            console.log(JSON.stringify(result));
            if (result.RESULTCODE == "-1") {
                mui.toast(result.DESCRIPTION);
            } else {
                mui.toast("当前网络不给力。");
            }
        });

        mui.app_request('POST', {
            "OPERATE_TYPE": "10003",
            "BEGIN": "0",
            "SIZE": "10"
        }, function (data) {


            var imgpic = data.RESULTLIST.result;
            var html = '';
            var htmls = '';
            for (var i = 0; i < imgpic.length; i++) {
                html += '<li>';
                html += '<a href="' + imgpic[i].click_url + '"><img src="' +
                    booking.constants.ip + imgpic[i].url + '" class="ban_img" data-url="' + imgpic[i].click_url + '" data-type="' + imgpic[i].click_type + '" /></a>';
                html += '</li>';
                htmls += '<li></li>';
            }
            $(".banner_img").html(html);
            //$(".point").html(htmls);
            banner();

            $(".banner_img").on("tap", "li", function () {
                var img = $(this).find("img");
                var type = img.attr("data-type");
                var url = img.attr("data-url");

                if (type == 0) {
                    return;
                } else if (type == 1) {
                    //mui.openWindow();
                    mui.openWindow({
                        url: url
                    });
                } else if (type == 2) {
                    window.location.href = url;
                }
            })


        }, function (result) {
            if (result.RESULTCODE == "-1") {
                mui.toast(result.DESCRIPTION)
            }
        }, true);


        //获取商户营业额笔数
        mui.app_request('POST', {
            "OPERATE_TYPE": "20021",
            "AUTH_ID": auid
        }, function (data) {
            //console.log("222:"+JSON.stringify(data))
            if (data.RESULTCODE == "0") {
                var data = data.RESULTLIST;
                $("#not_queued").html(data.pendingCount)
                $("#wait_queued").html(data.acceptedCount)
                $("#done_queued").html(data.finshedCount)
            }
        }, function (result) {
            console.log(JSON.stringify(result));
            if (result.RESULTCODE == "-1") {
                mui.toast(result.DESCRIPTION);
            } else {
                mui.toast("当前网络不给力。");
            }
        }, true);


        //获取商户信息
        mui.app_request('POST', {
            "OPERATE_TYPE": "20023",
            "AUTH_ID": auid
        }, function (data) {
            if (data.RESULTCODE == "0") {
                my_bz_info = data.RESULTLIST.my_bz_info;
                if (!mui.isnull(my_bz_info.wait_count)) {
                    $("#wait_count").html(my_bz_info.wait_count);
                }
                if (!mui.isnull(my_bz_info.not_queued_count)) {
                    $("#not_queued_count").html(my_bz_info.not_queued_count);
                }
                if (!mui.isnull(my_bz_info.done_count)) {
                    $("#done_count").html(my_bz_info.done_count);
                }
            }
            return;
        }, function (result) {
            console.log(JSON.stringify(result));
            if (result.RESULTCODE == "-1") {
                mui.toast(result.DESCRIPTION);
            } else {
                mui.toast("当前网络不给力。");
            }
        }, true)

        //收益信息
        mui.app_request('POST', {
            "OPERATE_TYPE": "20026",
            "AUTH_ID": auid
        }, function (data) {
            if (data.RESULTCODE == "0") {

                profit_info = data.RESULTLIST;
                $("#user_total_profit").html(returnFloat(profit_info.total_profit));
                if (profit_info.today_profit > 0) {
                    $("#user_today_profit").html("+" + returnFloat(profit_info.today_profit));
                    $("#today_prifit_show").show();
                }

            }
            return;
        }, function (result) {
            console.log(JSON.stringify(result));
            if (result.RESULTCODE == "-1") {
                mui.toast(result.DESCRIPTION);
            } else {
                mui.toast("当前网络不给力。");
            }

        }, true)


        if (type == 3) {
            //收益信息
            mui.app_request('POST', {
                "OPERATE_TYPE": "20025",
                "AUTH_ID": auid
            }, function (data) {
                if (data.RESULTCODE == "0") {
                    console.log(JSON.stringify(data));
                    my_shop_info = data.RESULTLIST.my_shop_info;
                    $("#bus_total_turnover").html(returnFloat(my_shop_info.turnover));

                    if (!mui.isnull(my_shop_info.view_today_pay_count) && my_shop_info.view_today_pay_count > 0) {
                        $("#user_today_turnover").html("+" + returnFloat(my_shop_info.view_today_turnover));
                        $("#today_turnover_show").show();
                    }

                }
                return;
            }, function (result) {
                console.log(JSON.stringify(result));
                if (result.RESULTCODE == "-1") {
                    mui.toast(result.DESCRIPTION);
                } else {

                    mui.toast("当前网络不给力。");
                }
            }, true)
        }
		//获取系统公告
		mui.app_request('POST', {
			"OPERATE_TYPE": "20032",
			"AUTH_ID": auid
		}, function(data) {
			console.log("系统公告："+JSON.stringify(data))
			if(data.RESULTCODE == "0") {
				var data = data.RESULTLIST;
				system(data);
			}
			return;
		}, function(result) {
			if(result.RESULTCODE == "-1") {
				mui.toast(result.DESCRIPTION);
			} else {
				mui.toast("当前网络不给力。");
			}
		})

        //跳转我要报账页面
        document.getElementById("buy_v").addEventListener('tap', function () {

            var attrValue = {
                type: 0,
                backId: "index"
            };
            localStorage.setItem("reimbur_me_attr", JSON.stringify(attrValue));
            booking.closeAndOpenNewWindow(
                'reimbur_me.html',
                'reimbur_me'
            )
        });
        //更多实时动态
        document.getElementById("more").addEventListener('tap', function () {
            booking.closeAndOpenNewWindow(
                'dynamic.html',
                'dynamic'
            )
        });
        document.getElementById("mores").addEventListener('tap', function () {
            booking.closeAndOpenNewWindow(
                'dynamic.html',
                'dynamic'
            )
        });
        //跳转我要报账页面
        document.getElementById("bus_buy_v").addEventListener('tap', function () {

            var attrValue = {
                type: 0,
                backId: "index"
            };
            localStorage.setItem("reimbur_me_attr", JSON.stringify(attrValue));
            booking.closeAndOpenNewWindow(
                'reimbur_me.html',
                'reimbur_me'
            )
        });

        //跳转我要报账页面
        document.getElementById("my_code").addEventListener('tap', function () {
            booking.closeAndOpenNewWindow(
                'myPayCode.html',
                'myPayCode'
            )
        });
        //跳转我要补贴说明
        document.getElementById("explain").addEventListener('tap', function () {
            booking.closeAndOpenNewWindow(
                '.././static_url/sale_cont.html',
                'sale_cont'
            )
        });

        //跳转我的报账记录页面
        mui("#select_type").on("tap", "li", function () {
            var type = this.querySelector(".gotoo").getAttribute("value");
            var attrValue = {
                status: type,
                backId: "index"
            };
            localStorage.setItem("my_accountss_attr", JSON.stringify(attrValue));
            booking.closeAndOpenNewWindow(
                'my_accountss.html',
                'my_accountss'
            )
        })
        //跳转我的报账记录页面
        mui("#shop_select_type").on("tap", "li", function () {
            var type = this.querySelector(".gotoo").getAttribute("value");
            var attrValue = {
                //shop_id:shop_id,
                status: type,
                backId: "index"
            };
            localStorage.setItem("my_account_attr", JSON.stringify(attrValue));
            booking.closeAndOpenNewWindow(
                'my_account.html',
                'my_account'
            )
        })

        //			//跳转扫一扫页面
        document.getElementById("saoyisao").addEventListener('click', function () {
            wx.scanQRCode({
                needResult: 1,
                desc: 'scanQRCode desc',
                success: function (res) {
                	alert(res.resultStr) ;
                    var val = res.resultStr;

                    if (val.indexOf("http") != -1) {
                        window.location.href = val;
                        return;
                    }
                    var result = JSON.parse(val);

                    if (mui.isnull(result.user_id)) {
                        mui.toast("无法验证的二维码.")
                        return;
                    }

                    if (mui.isnull(result.shop_id)) {
                        mui.toast("无法验证的二维码.")
                        return;
                    }
                    var extras = {
                        result: result,
                        backId: "index"
                    };
                    localStorage.setItem("i_wllpay_attr",JSON.stringify(extras));
                    mui.openWindow({
                        id: "i_wllpay",
                        url: "i_wllpay.html"
                    })

                }
            });
        });
        //跳转扫一扫页面
        document.getElementById("bus_saoyisao").addEventListener('tap', function () {
            wx.scanQRCode({
                needResult: 1,
                desc: 'scanQRCode desc',
                success: function (res) {
                	alert(1)
                    var val = res.resultStr;

                    if (val.indexOf("http") != -1) {
                        window.location.href = val;
                        return;
                    }
                    var result = JSON.parse(val);

                    if (mui.isnull(result.user_id)) {
                        mui.toast("无法验证的二维码.")
                        return;
                    }

                    if (mui.isnull(result.shop_id)) {
                        mui.toast("无法验证的二维码.")
                        return;
                    }
                    var extras = {
                        result: result,
                        backId: "index"
                    };
                    localStorage.setItem("i_wllpay_attr",JSON.stringify(extras));
                    mui.openWindow({
                        id: "i_wllpay",
                        url: "i_wllpay.html"
                    })

                }
            });
        });
    });

    //	图片轮播
    function banner() {
        TouchSlide({
            slideCell: "#banner",
            titCell: ".hb ul",
            mainCell: ".db ul",
            effect: "leftLoop",
            autoPage: true,
            autoPlay: true
        });
    }

    function dataUtil(time_data) {
        var date = new Date(time_data.replace(/-/g, "/"));
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minutes = date.getMinutes();
        if (hour < 10) {
            hour = "0" + hour;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        return hour + ":" + minutes;
    }

    function myScroll() {
        $('.scoll_msg').myScroll({
            speed: 3000, //数值越大，速度越慢
            rowHeight: 40 //li的高度
        });
    }

    function timeUtil(time) {
        var date = new Date(time.replace(/-/g, "/"));
        var hour = date.getHours();
        var minutes = date.getMinutes();
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        return hour + ":" + minutes;
    }

    function gogo() {
        var result = plus.storage.getItem('result');
        var setType = plus.storage.getItem("setType");
        plus.storage.removeItem("setType");
        if (result.indexOf("http") != -1) {
            plus.runtime.openURL(result);
            return;
        }
        ;
        console.log(result);
        if (setType) {
            if (!mui.os.ios) {
                result = result.substring(1, result.length - 1)
            }
        }


    }
    //系统公告弹框
		function system(data){
//			localStorage.removeItem("indexflag")
//			localStorage.removeItem("mytime")
			var id = data.id;
			console.log(type)
			var indexflag = localStorage.getItem("mui_indexflag");
			var oldtimes = localStorage.getItem("mui_mytime");
			var myid = localStorage.getItem("mui_myid");
			var newtime = new Date().getDate()+1;
			if(id != myid){
				localStorage.setItem("mui_myid", id);
				muiconfirm(data);
				return;
			};
			if(oldtimes != newtime && mui.isnull(indexflag)){
				localStorage.setItem("mui_mytime", newtime);
				muiconfirm(data);
			}
		}
		function muiconfirm(data){
			var type = data.blank_type;
			var btnhtml = '';
			if(type==1){
				btnhtml = '立即完善'
			}else{
				btnhtml = '查看详情'
			};
			mui.confirm(data.content, data.notice_title, ["取消",btnhtml], function(e) {
                if (e.index == 1) {
                    localStorage.setItem("mui_indexflag", "true"); 
                    if(type==1){
                    	booking.closeAndOpenNewWindow(
							'.././me/mer_cert.html',
							'mer_cert'
						)
                    }else if(type==2){
                    	booking.closeAndOpenNewWindow(
							'.././me/mine.html',
							'mine'
						)
                    }else if(type==3){
                    	booking.closeAndOpenNewWindow(
							'.././merchant/city_shop.html',
							'city_shop'
						)
                    }else if(type==4){
                    	booking.closeAndOpenNewWindow(
							'.././me/my_fans.html',
							'my_fans'
						)
                    }else if(type==5){
                    	booking.closeAndOpenNewWindow(
							'.././me/my_fans.html',
							'my_fans'
						)
                    }else if(type==6){
                    	booking.closeAndOpenNewWindow(
							'.././me/invitation.html',
							'invitation'
						)
                    }
                } else {
                    
                }
            })
		}