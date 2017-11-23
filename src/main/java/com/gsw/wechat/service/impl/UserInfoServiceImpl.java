package com.gsw.wechat.service.impl;


import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gsw.wechat.dao.UserInfoDao;
import com.gsw.wechat.entity.Userinfo;
import com.gsw.wechat.service.UserInfoService;

@Service
public class UserInfoServiceImpl implements UserInfoService {

	@Autowired
	private UserInfoDao userInfoDao ;
	
	@Override
	public Userinfo findUserInfoByMobile(String phone) {
		Map<String, Object> condition = new HashMap<>();
		condition.put("mobile", phone);
		return userInfoDao.findUserInfoByMobile(condition);
	}

}
