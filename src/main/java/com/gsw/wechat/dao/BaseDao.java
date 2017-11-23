package com.gsw.wechat.dao;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

import com.gsw.wechat.entity.BaseEntity;
import com.gsw.wechat.entity.PageRequest;
import com.gsw.wechat.entity.PageResponse;



public interface BaseDao<E extends BaseEntity> {

	E save(E entity);

	void save(List<E> entities);
	
	void update(E entity) ;

	boolean delete(E entity);

	E findById(Serializable id);

	int executeBySql(String sql, Map<String, Object> condition);

	E selectOne(String sql, Map<String, Object> condition,boolean isSQL);

	List<E> selectByHQL(String hql, Map<String, Object> condition);

	List<E> selectBySQL(String sql, Map<String, Object> condition);

	long CountByHQL(String sql, Map<String, Object> condition);

	long CountBySQL(String sql, Map<String, Object> condition);

	long CountBySQL(String sql, Object[] parms);
	
	PageResponse<E> selectByHQL(String hql, Map<String, Object> condition, PageRequest pageRequest);

	PageResponse<E> selectBySQL(String sql, Map<String, Object> condition, PageRequest pageRequest);

	PageResponse<Object> selectList(String sql, PageRequest pageRequest, Object[] parms);

	List<Map<String, Object>> selectList(String sql, Object[] parms);

	Object selectObject(String sql, Object[] parms);


}
