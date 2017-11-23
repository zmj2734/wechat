package com.gsw.wechat.dao.impl;

import java.util.Map;

import org.springframework.stereotype.Repository;

import com.gsw.wechat.dao.UserInfoDao;
import com.gsw.wechat.entity.Userinfo;

@Repository
public class UserInfoDaoImpl extends BaseDaoImpl<Userinfo> implements UserInfoDao {

	@Override
	public Userinfo findUserInfoByMobile(Map<String, Object> condition) {
		StringBuffer hql = new StringBuffer() ;
		hql.append(" from Userinfo where mobile = :mobile ") ;
		return selectOne(hql.toString(), condition, false) ;
	}

}
