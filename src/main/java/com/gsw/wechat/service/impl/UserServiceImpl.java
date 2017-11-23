package com.gsw.wechat.service.impl;

import java.util.HashMap;
import java.util.Map;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gsw.wechat.dao.UserDao;
import com.gsw.wechat.entity.Userinfo;
import com.gsw.wechat.entity.WechatUser;
import com.gsw.wechat.service.UserService;
import com.soecode.wxtools.bean.WxUserList.WxUser;

@Service
public class UserServiceImpl implements UserService {

	@Autowired
	private UserDao userDao;

	@Transactional
	@Override
	public WechatUser saveWechatUser(WxUser user) {
		Map<String, Object> condition = new HashMap<>();
		condition.put("open_id", user.getOpenid());
		WechatUser wUser = userDao.findByOpenId(condition);
		if (wUser == null) {
			wUser = new WechatUser();
			wUser.setCity(user.getCity());
			wUser.setCountry(user.getCountry());
			wUser.setHeadimgurl(user.getHeadimgurl());
			wUser.setNickname(user.getNickname());
			wUser.setOpen_id(user.getOpenid());
			wUser.setProvince(user.getProvince());
			wUser.setSex(user.getSex());
			wUser = userDao.save(wUser);
		}
		return wUser;
	}

	@Transactional
	@Override
	public void saveUserId(String openId, Integer userId) {
		Map<String, Object> condition = new HashMap<>();
		condition.put("open_id", openId);
		WechatUser wUser = userDao.findByOpenId(condition);
		if (wUser != null) {
			wUser.setUser_id(userId);
			userDao.update(wUser);
		}
	}

	@Transactional
	@Override
	public void unbindUser(String openId) {
		Map<String, Object> condition = new HashMap<>();
		condition.put("open_id", openId);
		userDao.deleteByOpenId(condition) ;
	}

	@Override
	public WechatUser findByOpenId(String openId) {
		Map<String, Object> condition = new HashMap<>();
		condition.put("open_id", openId);
		return userDao.findByOpenId(condition) ;
	}

	@Override
	public WechatUser findByOpenIdAndUserId(String openId, Integer userId) {
		Map<String, Object> condition = new HashMap<>();
		condition.put("open_id", openId);
		condition.put("user_id", userId);
		return userDao.findByOpenIdAndUserId(condition) ;
	}

	@Override
	public WechatUser findByUserId(Integer userId) {
		Map<String, Object> condition = new HashMap<>();
		condition.put("user_id", userId);
		return userDao.findByUserId(condition);
	}


}
