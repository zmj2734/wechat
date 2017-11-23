package com.gsw.wechat.service;

import com.gsw.wechat.entity.RequestBack;

public interface GswPayService {

	RequestBack WxPay(String orderNum);

}
