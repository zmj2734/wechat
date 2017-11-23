package com.gsw.wechat.entity;

import java.io.Serializable;
import java.util.List;

public class PageResponse<E> implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private PageRequest pageRequest ;
	/**
	 * 返回集合
	 */
	private List<E> resultList ;
	/**
	 * 返回总条数
	 */
	private long resultCount ;
	
	public PageResponse(PageRequest pageRequest){
		this.setPageRequest(pageRequest) ;
	}

	public PageRequest getPageRequest() {
		return pageRequest;
	}

	public void setPageRequest(PageRequest pageRequest) {
		this.pageRequest = pageRequest;
	}

	public List<E> getResultList() {
		return resultList;
	}

	public void setResultList(List<E> resultList) {
		this.resultList = resultList;
	}

	public long getResultCount() {
		return resultCount;
	}

	public void setResultCount(long resultCount) {
		this.resultCount = resultCount;
	}
}
