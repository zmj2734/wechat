package com.gsw.wechat.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.gsw.wechat.service.GswWxService;
import com.gsw.wechat.util.Constants;
import com.soecode.wxtools.bean.WxJsapiConfig;

@RestController
@RequestMapping("/wx")
public class WxController {
		
	@Autowired
	private GswWxService wxService ;
	
	/**
	 * Test
	 * @return
	 */
	@RequestMapping("/test")
	@ResponseBody
	public Map<String, Object> test() {
		Map<String, Object> result = new HashMap<String, Object>() ;
		result.put(Constants.RESULT_DESC_CODE, Constants.RESULT_SUCCESS) ;
		result.put(Constants.RESULT_DESC_FAIL, "test") ;
		return result ;
	}
	
	/**
	 * 后台创建微信菜单权限
	 * @param url
	 * @param jsApiList
	 * @return
	 */
	@RequestMapping("/createJsapiConfig")
	@ResponseBody
	public WxJsapiConfig createJsapiConfig(String url,String jsApiList){
		List<String> list = Arrays.asList(jsApiList.split(",")) ;
		return wxService.createJsapiConfig(url,list) ;
	}
	
	/**
	 * 微信验证
	 * @param response
	 * @param signature
	 * @param timestamp
	 * @param nonce
	 * @param echostr
	 */
	@RequestMapping("/checkSignature")
	@ResponseBody
	public void checkSignature(HttpServletResponse response,String signature,String timestamp,String nonce,String echostr) {
		// 通过检验signature对请求进行校验，若校验成功则原样返回echostr，表示接入成功，否则接入失败
		PrintWriter out;
		try {
			out = response.getWriter();
			if (wxService.checkSignature(signature, timestamp, nonce,echostr)) {
				out.print(echostr) ;
			}
			out.close();
			out = null ;
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * 获取AccessToken
	 */
	@RequestMapping("/getAccessToken")
	@ResponseBody
	public Map<String, Object> getAccessToken(){
		Map<String, Object> result = new HashMap<String, Object>() ;
		try {
			String ret = wxService.getAccessToken() ;
			result.put(Constants.RESULT_DESC_CODE, Constants.RESULT_SUCCESS) ;
			result.put(Constants.RESULT_DESC_LIST,ret) ;
		} catch (Exception e) {
			e.printStackTrace();
			result.put(Constants.RESULT_DESC_CODE, Constants.RESULT_FAIL_1) ;
			result.put(Constants.RESULT_DESC_FAIL,"获取信息失败") ;
		}
		return result ;
	}
	
	
	/**
	 * 获得jsapi_ticket,不强制刷新jsapi_ticket
	 * @return
	 */
	@RequestMapping("/getJsapiTicket")
	@ResponseBody
	public Map<String, Object> getJsapiTicket(){
		Map<String, Object> result = new HashMap<String, Object>() ;
		try {
			String ret = wxService.getJsapiTicket() ;
			result.put(Constants.RESULT_DESC_CODE, Constants.RESULT_SUCCESS) ;
			result.put(Constants.RESULT_DESC_LIST,ret) ;
		} catch (Exception e) {
			e.printStackTrace();
			result.put(Constants.RESULT_DESC_CODE, Constants.RESULT_FAIL_1) ;
			result.put(Constants.RESULT_DESC_FAIL,"获取信息失败") ;
		}
		return result ;
	}
}
