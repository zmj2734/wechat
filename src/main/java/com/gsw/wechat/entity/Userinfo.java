package com.gsw.wechat.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="userinfo")
public class Userinfo extends BaseEntity{

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue
	@Column
	private Integer id;
	
	@Column
	private String username;
	
	@Column
	private String mobile;
	
	@Column
	private String id_card;
	
	@Column
	private String real_name;
	
	@Column
	private Integer enable;
	
	@Column
	private Integer state;
	
	@Column
	private Date create_time;
	
	@Column
	private Double account_balance;
	
	@Column
	private Double cumulative_amount;
	
	@Column
	private Double recommended_earnings;
	
	@Column
	private String header_img;
	
	@Column
	private String nickname;
	
	@Column
	private String pay_pwd;
	
	@Column
	private double gold_count;
	
	@Column
	private String qr_code_url;

	@Override
	public Integer getId() {
		return id;
	}

	@Override
	public void setId(Integer id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getId_card() {
		return id_card;
	}

	public void setId_card(String id_card) {
		this.id_card = id_card;
	}

	public String getReal_name() {
		return real_name;
	}

	public void setReal_name(String real_name) {
		this.real_name = real_name;
	}

	public Integer getEnable() {
		return enable;
	}

	public void setEnable(Integer enable) {
		this.enable = enable;
	}

	public Integer getState() {
		return state;
	}

	public void setState(Integer state) {
		this.state = state;
	}

	public Date getCreate_time() {
		return create_time;
	}

	public void setCreate_time(Date create_time) {
		this.create_time = create_time;
	}

	public Double getAccount_balance() {
		return account_balance;
	}

	public void setAccount_balance(Double account_balance) {
		this.account_balance = account_balance;
	}

	public Double getCumulative_amount() {
		return cumulative_amount;
	}

	public void setCumulative_amount(Double cumulative_amount) {
		this.cumulative_amount = cumulative_amount;
	}

	public Double getRecommended_earnings() {
		return recommended_earnings;
	}

	public void setRecommended_earnings(Double recommended_earnings) {
		this.recommended_earnings = recommended_earnings;
	}

	public String getHeader_img() {
		return header_img;
	}

	public void setHeader_img(String header_img) {
		this.header_img = header_img;
	}

	public String getNickname() {
		return nickname;
	}

	public void setNickname(String nickname) {
		this.nickname = nickname;
	}

	public String getPay_pwd() {
		return pay_pwd;
	}

	public void setPay_pwd(String pay_pwd) {
		this.pay_pwd = pay_pwd;
	}

	public String getQr_code_url() {
		return qr_code_url;
	}

	public void setQr_code_url(String qr_code_url) {
		this.qr_code_url = qr_code_url;
	}

	public double getGold_count() {
		return gold_count;
	}

	public void setGold_count(double gold_count) {
		this.gold_count = gold_count;
	}
}
