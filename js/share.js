/**
 * 初始化分享服务
 */
function initSysShareSerivces(_callback) {
    plus.share.getServices(function(s) {
        shares = {};
        for (var i in s) { 
            var t = s[i];
            shares[t.id] = t;
        }
        if(plus.os.name == "Android") {
	        Intent = plus.android.importClass("android.content.Intent");
	        File = plus.android.importClass("java.io.File");
	        Uri = plus.android.importClass("android.net.Uri");
	        main = plus.android.runtimeMainActivity();
	    }
       _callback();
        outSet("获取分享服务列表成功！");
    }, function(e) {
        outSet("获取分享服务列表失败：" + e.message);
    });
}

 /**
 * 分享操作
 */
function shareAction(_id, _href,_title,_content,_thumbs,_pictures,_ex) {
    var _share = null;
    if (!_id || !(_share = shares[_id])) {
        outLine("无效的分享服务！");
        return;
    }
    if(!_share.nativeClient){
    	outLine("请先安装“"+_share.description+"”应用！");
    	return;
    }
    if (_share.authenticated) {
        outSet("---已授权---");
        sendShareMessage(_share,_href,_title,_content,_thumbs,_pictures,_ex);
    } else {
        outSet("---未授权---");
        _share.authorize(function() {
            sendShareMessage(_share,_href,_title,_content,_thumbs,_pictures,_ex);
        }, function(e) {
            outLine("认证授权失败！");
        });
    }
}

/**
 * 发送分享消息
 */
function sendShareMessage(_share,_href,_title,_content,_thumbs,_pictures,_ex) {
    var msg = getShareMessage(_href,_title,_content,_thumbs,_pictures,_ex)
    _share.send(msg, function() {
    	outLine( "分享到\""+_share.description+"\"成功！" );
    }, function(e) {
        outLine( "分享到\""+_share.description+"\"失败！ ");
    });
}

/**
 * 分享消息体
 */
function getShareMessage(_href,_title,_content,_thumbs,_pictures,_ex){
	var msg = {href: _href,title: _title,content: _content,extra: {scene: _ex}};
    if(_thumbs){
    	msg.thumbs=_thumbs;
    }else if(!_thumbs && plus.os.name == "iOS"){
    	msg.content=_content+_href;
    }
    if(_pictures){
    	msg.pictures=_pictures;
    }
    return msg;
}

// 控制台输出日志
function outSet(msg) {
    console.log(msg);
}
// 界面弹出吐司提示
function outLine(msg) {
    mui.toast(msg);
} 