package com.gsw.wechat.exception;

public class WxException extends Exception{
	private static final long serialVersionUID = 1L;

	public WxException(String message){
		super(message) ;
	}
}
