package com.gsw.wechat.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gsw.wechat.dao.ScOrderDao;
import com.gsw.wechat.entity.ScOrder;
import com.gsw.wechat.service.ScOrderService;

@Service
public class ScOrderServiceImpl implements ScOrderService{

	@Autowired
	private ScOrderDao  scOrderDao ;
	
	@Override
	public List<ScOrder> findByNum(String orderNum) {
		return scOrderDao.findByNum(orderNum);
	}

}
