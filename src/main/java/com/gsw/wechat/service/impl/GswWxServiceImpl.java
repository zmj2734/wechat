package com.gsw.wechat.service.impl;

import java.util.List;
import javax.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import com.gsw.wechat.service.GswWxService;
import com.gsw.wechat.util.Global;
import com.soecode.wxtools.api.WxService;
import com.soecode.wxtools.bean.WxJsapiConfig;
import com.soecode.wxtools.bean.WxUserList.WxUser;
import com.soecode.wxtools.bean.WxUserList.WxUser.WxUserGet;
import com.soecode.wxtools.bean.result.WxOAuth2AccessTokenResult;
import com.soecode.wxtools.exception.WxErrorException;

@Service
@Transactional
public class GswWxServiceImpl implements GswWxService{
	
	private static final Logger logger = LoggerFactory.getLogger(GswWxServiceImpl.class) ;
	
	private WxService wxService = new WxService() ;
	/**
	 * 微信签名
	 * @param request
	 * @param response
	 */
	@Override
	public boolean checkSignature(String signature,String timestamp,String nonce,String echostr)  {
		return wxService.checkSignature(signature, timestamp, nonce, echostr) ;
	}
	/**
	 * 票据
	 */
	@Override
	public String getJsapiTicket() {
		String result = null ;
		try {
			result = wxService.getJsapiTicket();
			return result ;
		} catch (WxErrorException e) {
			try {
				result = wxService.getJsapiTicket(true) ;
			} catch (WxErrorException e1) {
				e1.printStackTrace();
			}
		}
		logger.info("票据：" + result);
		return result ;
	}
	
	/**
	 * AccessToken
	 */
	@Override
	public String getAccessToken() {
		String access_token = null ;
		try {
			access_token = wxService.getAccessToken() ;
		} catch (WxErrorException e) {
			try {
				access_token = wxService.getAccessToken(true) ;
			} catch (WxErrorException e1) {
				e1.printStackTrace();
			}
		}
		return access_token ;
	}
	
	@Override
	public WxJsapiConfig createJsapiConfig(String url, List<String> jsApiList) {
		try {
			return wxService.createJsapiConfig(url, jsApiList) ;
		} catch (WxErrorException e) {
			e.printStackTrace();
		}
		return null ;
	}
	@Override
	public WxOAuth2AccessTokenResult oauth2ToGetAccessToken(String code) throws WxErrorException {
		WxOAuth2AccessTokenResult tokenResult = null ;
		try {
			tokenResult = wxService.oauth2ToGetAccessToken(code);
		} catch (Exception e) {
			tokenResult = wxService.oauth2ToGetRefreshAccessToken(Global.WXREFRESHTOKEN) ;
		}
		return tokenResult ;
	}
	@Override
	public WxUser oauth2ToGetUserInfo(String token, WxUserGet wxUserGet) throws WxErrorException {
		return wxService.oauth2ToGetUserInfo(token, wxUserGet);
	}
}
