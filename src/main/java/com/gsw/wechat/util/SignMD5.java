package com.gsw.wechat.util;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Formatter;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;

import com.gsw.wechat.payCore.WXPayConstants;

public class SignMD5 {
	public static String createNonceStr() {
		return UUID.randomUUID().toString().replaceAll(WXPayConstants.MIDDLE_LINE, WXPayConstants.EMPTY);
	}

	public static String createTimeStamp() {
		return Long.toString(System.currentTimeMillis() / 1000);
	}

	public static String byteToHex(final byte[] hash) {
		Formatter formatter = new Formatter();
		for (byte b : hash) {
			formatter.format("%02x", b);
		}
		String result = formatter.toString();
		formatter.close();
		return result;
	}

	public static String encode(CharSequence charSequence) {
		try {
			MessageDigest crypt = MessageDigest.getInstance(WXPayConstants.MD5);
			crypt.reset();
			crypt.update(charSequence.toString().getBytes(WXPayConstants.CHARTSET_UTF8));
			return byteToHex(crypt.digest());
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		return WXPayConstants.EMPTY;
	}

}
