package com.gsw.wechat.service;

import java.util.List;

import com.soecode.wxtools.bean.WxJsapiConfig;
import com.soecode.wxtools.bean.WxUserList.WxUser;
import com.soecode.wxtools.bean.WxUserList.WxUser.WxUserGet;
import com.soecode.wxtools.bean.result.WxOAuth2AccessTokenResult;
import com.soecode.wxtools.exception.WxErrorException;

public interface GswWxService {
	
	public boolean checkSignature(String signature,String timestamp,String nonce,String echostr) ;

	public String getJsapiTicket();

	public String getAccessToken();

	public WxJsapiConfig createJsapiConfig(String url, List<String> jsApiList);

	public WxOAuth2AccessTokenResult oauth2ToGetAccessToken(String code) throws WxErrorException;

	public WxUser oauth2ToGetUserInfo(String token, WxUserGet wxUserGet) throws WxErrorException;
}
