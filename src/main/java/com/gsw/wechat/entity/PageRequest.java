package com.gsw.wechat.entity;

import java.io.Serializable;

public class PageRequest implements Serializable{
	private static final long serialVersionUID = 1L;
	/**
	 * 当前页数
	 */
	private int currpage = 0 ;
	/**
	 * 每页显示条数
	 */
	private int pageSize = 10 ;
	
	
	public PageRequest(int currpage,int pageSize){
		this.setCurrpage(currpage) ;
		this.setPageSize(pageSize) ;
	}


	public int getCurrpage() {
		return currpage;
	}


	public void setCurrpage(int currpage) {
		this.currpage = currpage;
	}


	public int getPageSize() {
		return pageSize;
	}


	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
	}
	
	
}
