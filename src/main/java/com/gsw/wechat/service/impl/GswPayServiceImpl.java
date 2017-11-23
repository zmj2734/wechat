package com.gsw.wechat.service.impl;

import java.net.InetAddress;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gsw.wechat.entity.RequestBack;
import com.gsw.wechat.entity.ScOrder;
import com.gsw.wechat.exception.WxException;
import com.gsw.wechat.payCore.WXPayConstants.SignType;
import com.gsw.wechat.payCore.WXPayUtil;
import com.gsw.wechat.service.GswPayService;
import com.gsw.wechat.service.ScOrderService;
import com.gsw.wechat.util.Constants;
import com.gsw.wechat.util.DateUtils;
import com.gsw.wechat.util.PayConfig;
import com.gsw.wechat.util.RemoteUtils;
import com.soecode.wxtools.api.WxConfig;
import com.soecode.wxtools.api.WxService;

@Service
public class GswPayServiceImpl implements GswPayService {

	private static final Logger logger = LoggerFactory.getLogger(GswPayServiceImpl.class);
	public static String WX_NOTIFY_URL = "http://api.gs-xt.com/bz/pay/wxpay";

	@Autowired
	private ScOrderService ScOrderService;
	
	private WxService wxService = new WxService() ;

	@Override
	public RequestBack WxPay(String orderNum) {
		RequestBack result = new RequestBack();
		try {
			List<ScOrder> scOrders = ScOrderService.findByNum(orderNum);
			if (scOrders == null || scOrders.size() == 0) {
				throw new WxException("订单不存在！");
			}
			ScOrder scOrder = scOrders.get(0);
			if (scOrder.getState().intValue() != 0) {
				throw new WxException("订单状态错误！");
			}
			try {
				result = createWxOrder(orderNum, (Double.valueOf(scOrder.getAmount()*100)).intValue()) ;
			} catch (Exception e) {
				throw new WxException("微信授权失败") ;
			}
		} catch (Exception e) {
			e.printStackTrace();
			if (e instanceof WxException) {
				result.setCode(Constants.RESULT_FAIL_1);
				result.setCode(e.getMessage());
			}
		}
		return result;
	}
	
	/**
	 * 生成微信预支付订单
	 */
	public RequestBack createWxOrder(String orderId,int amount){
		RequestBack back = new RequestBack() ;
		Map<String, String> data = new HashMap<>() ;
		try {
			Calendar cal = Calendar.getInstance();
			data.put("appid", WxConfig.getInstance().getAppId()) ;
			data.put("mch_id", WxConfig.getInstance().getMchId()) ;
			data.put("device_info","WEB") ;
			data.put("nonce_str", UUID.randomUUID().toString().replaceAll("_", "")) ;
			data.put("body", "共生网商城") ;
			data.put("detail", "共生网商城") ;
			data.put("out_trade_no", orderId) ;
			data.put("total_fee", String.valueOf(amount)) ;
			data.put("spbill_create_ip", InetAddress.getLocalHost().getHostAddress()) ;
			data.put("time_start", DateUtils.formatDate(cal.getTime(), "yyyyMMddHHmmss")) ;
			cal.add(Calendar.DATE,1);
			data.put("time_expire", DateUtils.formatDate(cal.getTime(), "yyyyMMddHHmmss")) ;
			data.put("notify_url", WX_NOTIFY_URL) ;
			data.put("trade_type", "JSAPI") ;
			data.put("sign", WXPayUtil.generateSignature(data, PayConfig.ALIPAY_APP_KEY, SignType.MD5)) ;
			
			String payReult = RemoteUtils.post(PayConfig.WX_PAY_ORDER, data) ;
			Map<String, String> reMap = WXPayUtil.xmlToMap(payReult) ;
			
			Map<String, String> reDate = new HashMap<>() ;
			reDate.put("appId", reMap.get("appid")) ;
			reDate.put("timeStamp", String.valueOf(System.currentTimeMillis()).toString().substring(0,10)) ;
			reDate.put("nonceStr", reMap.get("nonce_str")) ;
			reDate.put("package", "prepay_id="+reMap.get("prepay_id")) ;
			reDate.put("signType", PayConfig.ALIPAY_SIGN_TYPE_MD5) ;
			reDate.put("paySign", WXPayUtil.generateSignature(reDate, PayConfig.ALIPAY_APP_KEY, SignType.MD5)) ;
			
			back.setDes("微信签名成功");
			back.setCode(RequestBack.SUCCESS_CODE);
			back.setObj(reDate);
		} catch (Exception e) {
			e.printStackTrace();
			back.setCode(RequestBack.ERROR_CODE);
			back.setDes("微信签名失败");
		}
		return back ;
	}
}
