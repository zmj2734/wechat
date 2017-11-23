package com.gsw.wechat.entity;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

public class RequestBack implements Serializable{
	
	private static final long serialVersionUID = 1L;
	
	public final static String SUCCESS_CODE = "0" ;
	
	public final static String ERROR_CODE = "-1" ;

	private String code = "0";
	
	private String des ;
	
	private List<Object> list ;
	
	private Object obj ;

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getDes() {
		return des;
	}

	public void setDes(String des) {
		this.des = des;
	}

	public List<Object> getList() {
		return list;
	}

	public void setList(List<Object> list) {
		this.list = list;
	}

	public Object getObj() {
		return obj;
	}

	public void setObj(Object obj) {
		this.obj = obj;
	}
	
	
}
