package com.gsw.wechat.entity;

import java.io.Serializable;

import javax.persistence.MappedSuperclass;
import javax.persistence.Transient;

@MappedSuperclass
public abstract class BaseEntity implements Serializable{
	private static final long serialVersionUID = 1L;
	/**实体主键*/
	@Transient
	public abstract Integer getId();
	/**实体主键*/
	@Transient
	public abstract void setId(Integer id);
}
