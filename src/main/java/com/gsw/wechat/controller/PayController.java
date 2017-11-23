package com.gsw.wechat.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.gsw.wechat.entity.RequestBack;
import com.gsw.wechat.service.GswPayService;


@RestController
@RequestMapping("/pay")
public class PayController {
	
	@Autowired
	private GswPayService payService ;
	
	@RequestMapping("/wxPay")
	@ResponseBody
	public RequestBack WxPay(String orderNum){
		return payService.WxPay(orderNum) ;
	}
}
