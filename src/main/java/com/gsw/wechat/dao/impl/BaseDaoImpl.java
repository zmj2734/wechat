package com.gsw.wechat.dao.impl;

import java.io.Serializable;
import java.util.List;
import java.util.Map;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.persistence.criteria.CriteriaBuilder;
import javax.transaction.Transactional;

import org.hibernate.SQLQuery;
import org.hibernate.transform.Transformers;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.ResolvableType;
import org.springframework.util.ClassUtils;
import org.springframework.util.StringUtils;

import com.gsw.wechat.dao.BaseDao;
import com.gsw.wechat.entity.BaseEntity;
import com.gsw.wechat.entity.PageRequest;
import com.gsw.wechat.entity.PageResponse;


public class BaseDaoImpl<E extends BaseEntity> implements BaseDao<E> {
	
	@PersistenceContext()
	protected EntityManager entityManager;
	
	protected Logger logger=LoggerFactory.getLogger(getClass());
	
	protected Class<E> entityClass;
	
	@SuppressWarnings("unchecked")
	public Class<E> getEntityClass() {
		ResolvableType resolvableType = ResolvableType.forClass(ClassUtils.getUserClass(getClass()));
		return (Class<E>)(Class<E>)resolvableType.as(BaseDao.class).getGeneric(0).resolve();
	}
	
	public BaseDaoImpl (){
		this.entityClass=getEntityClass();
	}
	
	protected CriteriaBuilder getCriteriaBuilder(){
		return entityManager.getCriteriaBuilder();  
	}
	
	@Override
	public E save(E entity){
		entityManager.merge(entity);
		entityManager.flush();
		return entity ;
	}
	
	@Transactional
	@Override
	public void save(List<E> entities){
		for (int i = 0; i < entities.size(); i++) {
			entityManager.merge(entities.get(i));
			if (i % 30 == 0) {
				entityManager.flush();
				entityManager.clear();
			}
		}
		entityManager.flush();
	}
	
	@Override
	public void update(E entity) {
		entityManager.merge(entity);
		entityManager.flush();
	}
	
	
	@Override
	public boolean delete(E entity){
		try {
			entityManager.remove(entityManager.find(entityClass, entity.getId()));
			entityManager.flush();
			return true ;
		} catch (Exception e) {
			e.printStackTrace();
			return false ;
		}
	}
	
	@Override
	public E findById(Serializable id) {
		return (E) entityManager.find(entityClass, id);
	}
	
	public List<E> findAll(){
		String hql = "from " + entityClass.getName() ;
		return selectByHQL(hql, null) ;
	}
	
	/**
	 * 执行对应增删改的HQL语句:update,delete,insert
	 * @param hql(增、删、改的Sql语句)
	 * @param condition
	 */
	@Override
	public int executeBySql(String sql, Map<String, Object> condition){
		Query q=entityManager.createNativeQuery(sql, entityClass);
		if(condition!=null&&!condition.isEmpty()){
			for (String key : condition.keySet()) {
				q.setParameter(key, condition.get(key));	
			}
		}
		return q.executeUpdate();
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public E selectOne(String sql, Map<String, Object> condition,boolean isSQL){
		Query q=isSQL?entityManager.createNativeQuery(sql, entityClass):entityManager.createQuery(sql, entityClass);
		if(condition!=null&&!condition.isEmpty()){
			for (String key : condition.keySet()) {
				q.setParameter(key, condition.get(key));	
			}
		}
		List<E> list = q.getResultList() ;
		if(list != null && list.size() > 0){
			return list.get(0) ;
		}
		return null ;
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<E> selectByHQL(String hql, Map<String, Object> condition){
		Query q=entityManager.createQuery(hql, entityClass);
		if(condition!=null&&!condition.isEmpty()){
			for (String key : condition.keySet()) {
				q.setParameter(key, condition.get(key));	
			}
		}
		return q.getResultList() ;
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<E> selectBySQL(String sql, Map<String, Object> condition){
		Query q=entityManager.createNativeQuery(sql, entityClass);
		if(condition!=null&&!condition.isEmpty()){
			for (String key : condition.keySet()) {
				q.setParameter(key, condition.get(key));	
			}
		}
		return q.getResultList() ;
	}
	
	@Override
	public long CountByHQL(String hql, Map<String, Object> condition){
		return (long) CountBySQL(hql, condition, false) ;
	}
	
	@Override
	public long CountBySQL(String sql, Map<String, Object> condition){
		return (long) CountBySQL(sql, condition, true) ;
	}
	
	@Override
	public long CountBySQL(String sql, Object...parms){
		if(StringUtils.isEmpty(sql))
			return 0 ;
		StringBuffer countSql = new StringBuffer() ;
		countSql.append("select count(1) from ( ") ;
		countSql.append(sql) ;
		countSql.append(" ) a") ;
		Query q = entityManager.createNativeQuery(countSql.toString()) ;
		if(parms!=null && parms.length>0){
			for (int i = 0; i < parms.length; i++) {
				q.setParameter(0, parms[i]) ;
			}
		}
		return (long) q.getSingleResult() ;
	}
	
	private Object CountBySQL(String sql, Map<String, Object> condition,boolean isSQL){
		if(StringUtils.isEmpty(sql))
			return null ;
		sql = "select count(1)" + sql.substring(sql.indexOf("from")) ;
		Query q=isSQL?entityManager.createNativeQuery(sql, entityClass):entityManager.createQuery(sql, entityClass);
		if(condition!=null&&!condition.isEmpty()){
			for (String key : condition.keySet()) {
				q.setParameter(key, condition.get(key));	
			}
		}
		return q.getSingleResult() ;
	}
	
	@SuppressWarnings({ "unchecked"})
	@Override
	public PageResponse<E> selectByHQL(String hql, Map<String, Object> condition,PageRequest pageRequest){
		Query q=entityManager.createQuery(hql, entityClass);
		if(condition!=null&&!condition.isEmpty()){
			for (String key : condition.keySet()) {
				q.setParameter(key, condition.get(key));	
			}
		}
		q.setFirstResult(pageRequest.getCurrpage()) ;
		q.setMaxResults(pageRequest.getPageSize()) ;
		PageResponse<E> pageResponse = new PageResponse<E>(pageRequest) ;
		pageResponse.setResultList(q.getResultList());
		pageResponse.setResultCount(CountByHQL(hql, condition));
		return pageResponse ;
	}
	
	@SuppressWarnings({ "unchecked"})
	@Override
	public PageResponse<E> selectBySQL(String sql, Map<String, Object> condition,PageRequest pageRequest){
		Query q=entityManager.createNativeQuery(sql, entityClass);
		if(condition!=null&&!condition.isEmpty()){
			for (String key : condition.keySet()) {
				q.setParameter(key, condition.get(key));	
			}
		}
		q.setFirstResult(pageRequest.getCurrpage()) ;
		q.setMaxResults(pageRequest.getPageSize()) ;
		PageResponse<E> pageResponse = new PageResponse<E>(pageRequest) ;
		pageResponse.setResultList(q.getResultList());
		pageResponse.setResultCount(CountBySQL(sql, condition));
		return pageResponse ;
	}
	
	/**
	 * 原生SQL查询,返回单例Map
	 */
	@SuppressWarnings("unchecked")
	@Override
	public Map<String, Object> selectObject(String sql ,Object...parms){
		 org.hibernate.Query q = entityManager.createNativeQuery(sql).unwrap(SQLQuery.class).setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP)  ;
		if(parms!=null && parms.length>0){
			for (int i = 0; i < parms.length; i++) {
				q.setParameter(0, parms[i]) ;
			}
		}
		
		return  (Map<String, Object>) q.uniqueResult() ;
	}

	/**
	 * 原生SQL查询,返回LiST
	 */
	@SuppressWarnings("unchecked")
	@Override
	public List<Map<String, Object>> selectList(String sql ,Object...parms){
		org.hibernate.Query q = entityManager.createNativeQuery(sql).unwrap(SQLQuery.class).setResultTransformer(Transformers.TO_LIST) ;
		if(parms!=null && parms.length>0){
			for (int i = 0; i < parms.length; i++) {
				q.setParameter(0, parms[i]) ;
			}
		}
		return q.list() ;
	}
	/**
	 * 原生SQL分页查询,返回封装对象
	 */
	@SuppressWarnings("unchecked")
	@Override
	public PageResponse<Object> selectList(String sql ,PageRequest pageRequest,Object...parms){
		org.hibernate.Query q = entityManager.createNativeQuery(sql).unwrap(SQLQuery.class).setResultTransformer(Transformers.TO_LIST)  ;
		if(parms!=null && parms.length>0){
			for (int i = 0; i < parms.length; i++) {
				q.setParameter(0, parms[i]) ;
			}
		}
		q.setFirstResult(pageRequest.getCurrpage()) ;
		q.setMaxResults(pageRequest.getPageSize()) ;
		PageResponse<Object> pageResponse = new PageResponse<Object>(pageRequest) ;
		pageResponse.setResultList(q.list());
		pageResponse.setResultCount(CountBySQL(sql, parms));
		return pageResponse ;
	}
	
}
