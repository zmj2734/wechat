package com.gsw.wechat.controller;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;
import com.gsw.wechat.util.Constants;
import com.gsw.wechat.util.RemoteUtils;
import com.soecode.wxtools.api.WxService;
import com.soecode.wxtools.exception.WxErrorException;


@RestController
@RequestMapping("/remote")
public class HttpController {
	
	private WxService wxService = new WxService() ;
	
	/**
	 * loadWxImage
	 * @param request
	 * @param response
	 * @param INVOICE_URL 发票路径
	 * @throws WxErrorException 
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping("/dowloadWxImage")
	@ResponseBody
	public Map<String, Object> dowloadWxImage(HttpServletRequest request ,HttpServletResponse response,String INVOICE_URL) throws WxErrorException{
		Map<String, Object> result = new HashMap<>() ;
		File file = new File("/wxDowload/") ;
		if(!file.exists()){
        	file.mkdirs() ;
        }
		File dowloadFile = wxService.downloadTempMedia(INVOICE_URL, file) ;
		try {
			String str = RemoteUtils.upload(dowloadFile) ;
			System.out.println(str);
			Object json = JSONObject.parse(str) ;
			result = (Map<String, Object>) json ;
			return result ;
		} catch (Exception e) {
			e.printStackTrace();
			result.put(Constants.RESULT_DESC_CODE, Constants.RESULT_FAIL_1) ;
			result.put(Constants.RESULT_DESC_FAIL, "提交失败") ;
		}
		return result ;
	}
	
	@RequestMapping("/post")
	@ResponseBody
	public Map<String, Object> post(HttpServletRequest request ,HttpServletResponse response) throws WxErrorException{
		Map<String, Object> result = new HashMap<>() ;
		try {
			String str = RemoteUtils.post(RemoteUtils.toMap(request)) ;
			result.put(Constants.RESULT_DESC_CODE, Constants.RESULT_SUCCESS) ;
			result.put(Constants.RESULT_DESC_FAIL, str) ;
		} catch (Exception e) {
			e.printStackTrace();
			result.put(Constants.RESULT_DESC_CODE, Constants.RESULT_FAIL_1) ;
			result.put(Constants.RESULT_DESC_FAIL, "提交失败") ;
		}
		return result ;
	}
	
	
	 
}
