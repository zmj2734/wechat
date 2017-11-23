package com.gsw.wechat.dao;

import java.util.List;

import com.gsw.wechat.entity.ScOrder;

public interface ScOrderDao {

	List<ScOrder> findByNum(String orderNum);

}
