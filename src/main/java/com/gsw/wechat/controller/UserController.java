package com.gsw.wechat.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.gsw.wechat.entity.Userinfo;
import com.gsw.wechat.entity.WechatUser;
import com.gsw.wechat.service.GswWxService;
import com.gsw.wechat.service.UserInfoService;
import com.gsw.wechat.service.UserService;
import com.gsw.wechat.util.Constants;
import com.gsw.wechat.util.Global;
import com.soecode.wxtools.api.WxConsts;
import com.soecode.wxtools.bean.WxUserList.WxUser;
import com.soecode.wxtools.bean.WxUserList.WxUser.WxUserGet;
import com.soecode.wxtools.bean.result.WxOAuth2AccessTokenResult;
@RestController
@RequestMapping("/user")
public class UserController {
	
	@Autowired
	public UserInfoService userInfoService;
	
	@Autowired
	public UserService userService ;
	
	@Autowired
	private GswWxService wxService ;
	
	/**
	 * 授权登录获取用户信息
	 */
	@RequestMapping("/getUserInfoBycode")
	@ResponseBody
	public Map<String, Object> getUserInfoBycode(String code) {
		Map<String, Object> result = new HashMap<String, Object>();
		try {
			WxOAuth2AccessTokenResult tokenResult = wxService.oauth2ToGetAccessToken(code);
			String token = tokenResult.getAccess_token();
			Global.WXREFRESHTOKEN = tokenResult.getRefresh_token() ;
			String openid = tokenResult.getOpenid();
			WxUser user = wxService.oauth2ToGetUserInfo(token, new WxUserGet(openid, WxConsts.LANG_CHINA));
			// 查询该用户是否已绑定
			WechatUser wechatUser = userService.saveWechatUser(user);
			result.put(Constants.RESULT_DESC_CODE, Constants.RESULT_SUCCESS);
			result.put(Constants.RESULT_DESC_LIST, wechatUser);
		} catch (Exception e) {
			e.printStackTrace();
			result.put(Constants.RESULT_DESC_CODE, Constants.RESULT_FAIL_1);
			result.put(Constants.RESULT_DESC_FAIL, Constants.DESCRIPTION_ERROR);
		}
		return result;
	}
	
	/**
	 * OpenId是否已绑定
	 * @param openId
	 * @param phone
	 * @return
	 */
	@RequestMapping("/checkBind")
	@ResponseBody
	public boolean checkBind(String openId ,String phone){
		Userinfo user = userInfoService.findUserInfoByMobile(phone) ;
		WechatUser weUser = userService.findByUserId(user.getId()) ;
		return weUser == null ? false :true ;
	}
	
	/**
	 * openId 与 userId 绑定
	 * @param openId
	 * @param userId
	 */
	@RequestMapping("/saveUserId")
	@ResponseBody
	public void saveUserId(String openId , Integer userId){
		userService.saveUserId(openId,userId) ;
	}
	
	/**
	 * 解除绑定
	 * @param openId
	 */
	@RequestMapping("/unbind")
	@ResponseBody
	public void unbindUser(String openId){
		userService.unbindUser(openId) ;
	}
	

}
