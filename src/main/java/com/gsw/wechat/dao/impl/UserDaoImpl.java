package com.gsw.wechat.dao.impl;

import java.util.Map;

import org.springframework.stereotype.Repository;

import com.gsw.wechat.dao.UserDao;
import com.gsw.wechat.entity.Userinfo;
import com.gsw.wechat.entity.WechatUser;

@Repository
public class UserDaoImpl extends BaseDaoImpl<WechatUser> implements UserDao {

	
	
	@Override
	public WechatUser findByOpenId(Map<String, Object> condition ) {
		StringBuffer hql = new StringBuffer() ;
		hql.append(" from WechatUser where open_id = :open_id") ;
		return selectOne(hql.toString(), condition, false);
	}

	@Override
	public void deleteByOpenId(Map<String, Object> condition) {
		StringBuffer sql = new StringBuffer() ;
		sql.append(" delete from wechat_user where open_id = :open_id") ;
		executeBySql(sql.toString(), condition) ;
	}

	@Override
	public WechatUser findByOpenIdAndUserId(Map<String, Object> condition) {
		StringBuffer hql = new StringBuffer() ;
		hql.append(" from WechatUser where open_id = :open_id and user_id = :user_id") ;
		return selectOne(hql.toString(), condition, false);
	}

	@Override
	public WechatUser findByUserId(Map<String, Object> condition) {
		StringBuffer hql = new StringBuffer() ;
		hql.append(" from WechatUser where user_id = :user_id") ;
		return selectOne(hql.toString(), condition, false);
	}

}
