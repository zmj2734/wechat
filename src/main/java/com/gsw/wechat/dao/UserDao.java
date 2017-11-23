package com.gsw.wechat.dao;

import java.util.Map;

import com.gsw.wechat.entity.WechatUser;

public interface UserDao {
	
	WechatUser findByOpenId(Map<String, Object> condition);
	
	WechatUser save(WechatUser user) ;

	void deleteByOpenId(Map<String, Object> condition);

	void update(WechatUser wUser);

	WechatUser findByOpenIdAndUserId(Map<String, Object> condition);

	WechatUser findByUserId(Map<String, Object> condition);
}
