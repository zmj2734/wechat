package com.gsw.wechat.service;

import java.util.List;

import com.gsw.wechat.entity.ScOrder;

public interface ScOrderService {
	List<ScOrder> findByNum(String orderNum) ;
}
