(function($,window,document,undefined){
    $.fn.selectAddress=function(options){
        self.flag=false;//boolean,通过控制true or false, 防止恶意切换
        self.text=null;//回调时,用来储存选择到的地址数据
        this.default={
            "ajaxURL":"#",//ajax请求数据的地址
            "speed":300,//切换的速度
            storageBox:"",//在选择地址用，用来储存地址数据的盒子
            callback:function(){}
        }
        this.option=$.extend({},this.default,options);
        var arrText="";//储存选择到的数据，添加到storageBox中
        var op=this.option;
        // 初始化入口
        this.init=function(){
            var self=this;
            this.createEle();
            this.createProvince();
            // 点击关闭按钮的时候按钮的时候
            self.closeBtn.on("click",function(){
                self.maskHidie();
            })
            self.aInfo.on("click",function(){
                var index=$(this).index();
                self.clickInfo($(this),index);
            });
            self.mask.on("click",function(event){
                if($(event.target).attr("id")=="toogle-mask"){
                    self.maskHidie();
                }
            })
        }
        // 创建toogle-mask模块
        this.createEle=function(){
            var self=this;
            self.mask=$('<div class="toogle-address-mask" id="toogle-mask"></div>');
//          self.maskChild=$('<div class="toogle-address" id="toggleCont"><div class="toogle-address-title border-b"><i class="mui-icon mui-icon-closeempty icon-x"></i>请选择地址<i class="icon icon-close" id="closeBtn"></i></div><div id="address" class="address"><div class="address-header"><span class="address-info address-now" id="provience">请选择</span><span class="address-info" id="city">请选择</span><span class="address-info" id="county">请选择</span></div><div class="address-content"><div class="address-cont"><ul class="provienc-part" data-create="createCity" data-index="1"></ul><ul class="city-part" data-create="createCounty" data-index="2"></ul><ul class="county-part" data-index="3"></ul></div></div></div></div>');
            self.maskChild=$('<div class="toogle-address" id="toggleCont"><div class="toogle-address-title border-b"><i class="mui-icon mui-icon-closeempty icon-x" id="icon-x"></i>请选择区域</i></div><div id="address" class="address"><div class="address-header"><span class="address-info address-now" id="provience">请选择</span><span class="address-info" id="city">请选择</span><span class="address-info" id="county">请选择</span></div><div class="address-content"><div class="address-cont"><ul class="provienc-part" data-create="createCity" data-index="1"></ul><ul class="city-part" data-create="createCounty" data-index="2"></ul><ul class="county-part" data-index="3"></ul></div></div></div></div>');
            $("body").append(self.mask);
            self.mask.append(self.maskChild);
            self.closeBtn=$("#icon-x");//关闭按钮
           // self.closeBtn=$("#closeBtn",self.mask);//关闭按钮
            self.toogleMask=$("#toggleCont",self.mask);//选择地址的内容区
            self.aInfo=$(".address-info",self.mask);//选择省市区选项
            self.AddressCont=$(".address-cont",self.mask);//三个地址列表包裹的层
            self.mask.animate({
                opacity:1,
                
            },100,function(){
                self.maskChild.css({"bottom":'-300px'}).animate({
                    "left":"0",
                    "bottom":"0",
                    "z-index": "99"
                },op.speed);
            })
        }
        // 创建省模块
        this.createProvince=function(){
            var self=this;
            var app_type;
			if(mui.os.ios) {
				app_type = 'ios'
			}else{
				app_type = "android"
			}
			var timestamp = Date.parse(new Date());
			var interface_version = '2.0'
			var opreate_type = "10006";
			var sign = interface_version + app_type + timestamp + opreate_type;
			sign = Encrypt(sign);
            var data={
            	"OPERATE_TYPE": "10006",
				"app_type": app_type,
				"timestamp": timestamp,
				"interface_version": interface_version,
				"sign": sign.toString()
            }
            self.addressAjax(self.AddressCont.find('.provienc-part'),null,1,data);
        }
        // 创建市模块
        this.createCity=function(dataValue){
            var self=this;
            var app_type;
			if(mui.os.ios) {
				app_type = 'ios'
			}else{
				app_type = "android"
			}
			var timestamp = Date.parse(new Date());
			var interface_version = '2.0'
			var opreate_type = "10007";
			var sign = interface_version + app_type + timestamp + opreate_type;
			sign = Encrypt(sign);
            var data={
            	"OPERATE_TYPE": "10007",
            	"PROVINCE_ID": dataValue,
				"app_type": app_type,
				"timestamp": timestamp,
				"interface_version": interface_version,
				"sign": sign.toString()
            }
            $('.address-cont').scrollTop(0);
            self.mask.find("#city").show();
            self.AddressCont.find('.city-part').empty();
            self.addressAjax(self.AddressCont.find('.city-part'),dataValue,2,data);
        }
        // 创建区域模块
        this.createCounty=function(dataValue){
            var self=this;
            var app_type;
			if(mui.os.ios) {
				app_type = 'ios'
			}else{
				app_type = "android"
			}
			var timestamp = Date.parse(new Date());
			var interface_version = '2.0'
			var opreate_type = "10008";
			var sign = interface_version + app_type + timestamp + opreate_type;
			sign = Encrypt(sign);
            var data={
            	"OPERATE_TYPE": "10008",
            	"CITY_ID": dataValue,
				"app_type": app_type,
				"timestamp": timestamp,
				"interface_version": interface_version,
				"sign": sign.toString()
            }
            $('.address-cont').scrollTop(0);
            self.mask.find("#county").show();
            self.AddressCont.find('.county-part').empty();
            self.addressAjax(self.AddressCont.find('.county-part'),dataValue,3,data);
        }
        // 点击选择地址
        this.clickfn=function (district){
            var self=this;
            district.on('click',function(event){
                var _this=$(this);
                var parent=_this.parent();
                var dataValue=_this.data("value");
                //console.log("data-value:"+dataValue)
                var parentCreate=parent.data("create");
                var dataIndex=parent.data("index");
                _this.parent().find('li').removeClass("liNow");
                _this.addClass("liNow");
                self.aInfo.eq(dataIndex-1).html(_this.text());
                if(parentCreate=='createCity'){
                    self.createCity(dataValue);
                }else if(parentCreate=="createCounty"){
                    self.createCounty(dataValue);
                }
                if(dataIndex==3){
                    // 如果dataIndex=3,说明选择的是区域，执行移除toogle-address模块
                    self.maskHidie();
                }else{
                    // 如果dataIndex小于3，执行clickInfo
                    self.clickInfo(self.aInfo.eq(dataIndex),dataIndex);
                }
            })
        }
        // 移除toogle-address模块
        this.maskHidie=function(){
            var self=this;
            self.toogleMask.animate({
                bottom:"-300px"
            },op.speed,function(){
                self.mask.animate({
                    'opacity':0
                },200,function(){
                    self.addressInput();
                    if(op.callback&& typeof op.callback=="function"){
                        // 执行回调函数
                        //console.log(self.text)
                        op.callback(self.text,self.id);
                    }
                })
            })
        }
        // 将数据存放到input表单中
        this.addressInput=function(){
            var self=this;
            var boxHtml="";
            var text="";
            var id='';
            //console.log("长度1："+op.storageBox.find("span").length) 
            for(var i=0;i<op.storageBox.find("span").length;i++){
                boxHtml=op.storageBox.find("span").eq(i).text()+" ";
            }
            //console.log("长度2："+$(".liNow").length) 
            if($(".liNow").length==3){
            	for(var i=0;i<$(".liNow").length;i++){
	                arrText="<span>"+$(".liNow").eq(i).text()+"</span>";
	                id = $(".liNow").eq(i).data("value");
	                text=$(".liNow").eq(i).text()+" ";
	            };
            }
            //console.log("id:"+id)
            // 如果arrText不为空
            if(arrText!=""){
                op.storageBox.html(arrText);
                self.text=text;
                self.id = id;
            }else{
                //self.text=boxHtml;
                self.text='';
            } 
            self.mask.remove();
        }
        this.clickInfo=function(ele,index){
            var self=this;
            self.flag=true;
            if(self.flag){
                self.flag=false;
                ele.addClass("address-now").siblings().removeClass("address-now");
                self.AddressCont.animate({
                    "margin-left":"-"+index*100+"%"
                },op.speed);
                self.flag=true;
            }
        }
        // 通过ajax请求数据
        this.addressAjax = function(district, cValue, ov, data,type) {
        	//console.log("data:"+JSON.stringify(data))
            var self=this;
            var oType = null;
            district.empty();
            $.ajax({
                type:"post",
				data:data,
				url:booking.constants.api_domain,
				async:true,
                success: function(data) {
                    //console.log(JSON.stringify(data));
                    district.empty();
                    oType = data.RESULTLIST.result; //请求区的数据
                    this.countyItem='';
                    //console.log(oType)
                    $.each(oType, function(key, value) {
                    	//console.log("value:"+value)
                        if (cValue == null) {
                        	if (ov == 3) {
		                        this.countyItem =  $("<li data-value='" + value.id + "'>" + value.district_name + "</li>"); //请求区的数据
		                    } else if (ov == 2) {
		                        this.countyItem =  $("<li data-value='" + value.id + "'>" + value.city_name + "</li>"); //请求市的数据
		                    } else if (ov == 1) {
		                        this.countyItem =  $("<li data-value='" + value.id + "'>" + value.province_name + "</li>"); //请求省的数据
		                    }
                        } else {
                            if (ov == 3) {
		                        this.countyItem =  $("<li data-value='" + value.id + "'>" + value.district_name + "</li>"); //请求区的数据
		                    } else if (ov == 2) {
		                        this.countyItem =  $("<li data-value='" + value.id + "'>" + value.city_name + "</li>"); //请求市的数据
		                    } else if (ov == 1) {
		                        this.countyItem =  $("<li data-value='" + value.id + "'>" + value.province_name + "</li>"); //请求省的数据
		                    }
                        }
                        district.append(this.countyItem);
                    });
                    self.clickfn(district.find("li"));
                },
                error: function() {
                    console.log('ajax error')
                }
            })
        }
        return this.init();
    }
})(jQuery,window,document);
