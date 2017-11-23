package com.gsw.wechat.dao;

import java.util.Map;

import com.gsw.wechat.entity.Userinfo;

public interface UserInfoDao {

	Userinfo findUserInfoByMobile(Map<String, Object> condition);

}
