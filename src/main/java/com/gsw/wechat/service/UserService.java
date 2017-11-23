package com.gsw.wechat.service;

import com.gsw.wechat.entity.WechatUser;
import com.soecode.wxtools.bean.WxUserList.WxUser;

public interface UserService {

	WechatUser saveWechatUser(WxUser user);

	void saveUserId(String openId, Integer userId);

	void unbindUser(String openId);

	WechatUser findByOpenId(String openId);

	WechatUser findByOpenIdAndUserId(String openId, Integer userId);

	WechatUser findByUserId(Integer id);

}
