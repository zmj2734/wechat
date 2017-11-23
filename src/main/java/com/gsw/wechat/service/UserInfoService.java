package com.gsw.wechat.service;

import com.gsw.wechat.entity.Userinfo;

public interface UserInfoService {

	Userinfo findUserInfoByMobile(String phone);

}
