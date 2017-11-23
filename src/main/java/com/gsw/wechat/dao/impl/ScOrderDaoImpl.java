package com.gsw.wechat.dao.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.gsw.wechat.dao.ScOrderDao;
import com.gsw.wechat.entity.ScOrder;
@Repository
public class ScOrderDaoImpl extends BaseDaoImpl<ScOrder> implements ScOrderDao {

	@Override
	public List<ScOrder> findByNum(String orderNum) {
		Map<String, Object> condition = new HashMap<String, Object>() ;
		condition.put("order_num", orderNum) ;
		return selectByHQL("from ScOrder where order_num = :order_num", condition);
	}

}
