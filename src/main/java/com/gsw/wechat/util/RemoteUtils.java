package com.gsw.wechat.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.codec.binary.Base64;
import org.apache.http.HttpEntity;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.entity.mime.content.StringBody;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import com.soecode.wxtools.util.RandomUtils;

public class RemoteUtils {

	/**
	 * 上传文件
	 * 
	 * @return
	 */
	public static String upload(File file) throws Exception {
		String respStr = null;
		CloseableHttpClient httpclient = HttpClients.createDefault();
		try {
			HttpPost httppost = new HttpPost(Constants.REMOTE_URL);
			MultipartEntityBuilder multipartEntityBuilder = MultipartEntityBuilder.create();
			String fileName = RandomUtils.getRandomStr(16);
			String timestamp = String.valueOf(new Date().getTime());
			String app_type = "weixin";
			String interface_version = "2.0";
			String operate_type = "10013";
			multipartEntityBuilder.addPart("IMAGE", new StringBody(fileToBase64(file), ContentType.TEXT_PLAIN));
			multipartEntityBuilder.addPart("OPERATE_TYPE", new StringBody(operate_type, ContentType.TEXT_PLAIN));
			multipartEntityBuilder.addPart("NAME", new StringBody(fileName, ContentType.TEXT_PLAIN));
			multipartEntityBuilder.addPart("app_type", new StringBody(app_type, ContentType.TEXT_PLAIN));
			multipartEntityBuilder.addPart("timestamp", new StringBody(timestamp, ContentType.TEXT_PLAIN));
			multipartEntityBuilder.addPart("interface_version",
					new StringBody(interface_version, ContentType.TEXT_PLAIN));
			multipartEntityBuilder.addPart("sign", new StringBody(
					AESUtils.encrypt(interface_version + app_type + timestamp + operate_type), ContentType.TEXT_PLAIN));
			HttpEntity reqEntity = multipartEntityBuilder.build();
			httppost.setEntity(reqEntity);
			CloseableHttpResponse response = httpclient.execute(httppost);
			try {
				HttpEntity resEntity = response.getEntity();
				respStr = getRespString(resEntity);
				EntityUtils.consume(resEntity);
			} finally {
				response.close();
			}
		} finally {
			httpclient.close();
		}
		return respStr;
	}

	/**
	 * Post 请求到指定服务器
	 * 不通用
	 * @param params
	 * @return
	 */
	public static String post(Map<String, Object> params) throws Exception {
		String respStr = null;
		CloseableHttpClient httpclient = HttpClients.createDefault();
		try {
			HttpPost httppost = new HttpPost(Constants.REMOTE_URL);
			MultipartEntityBuilder multipartEntityBuilder = MultipartEntityBuilder.create();
			setUploadParams(multipartEntityBuilder, params);
			HttpEntity reqEntity = multipartEntityBuilder.build();
			httppost.setEntity(reqEntity);
			CloseableHttpResponse response = httpclient.execute(httppost);
			try {
				HttpEntity resEntity = response.getEntity();
				respStr = getRespString(resEntity);
				EntityUtils.consume(resEntity);
			} finally {
				response.close();
			}
		} finally {
			httpclient.close();
		}
		return respStr;
	}
	
	/**
	 * 通用
	 * @param url
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public static String post(String url, Map<String, String> params) throws Exception {
		String respStr = null;
		CloseableHttpClient httpclient = HttpClients.createDefault();
		try {
			HttpPost httppost = new HttpPost(url);
			MultipartEntityBuilder multipartEntityBuilder = MultipartEntityBuilder.create();
			HttpEntity reqEntity = multipartEntityBuilder.build();
			httppost.setEntity(reqEntity);
			CloseableHttpResponse response = httpclient.execute(httppost);
			try {
				HttpEntity resEntity = response.getEntity();
				respStr = getRespString(resEntity);
				EntityUtils.consume(resEntity);
			} finally {
				response.close();
			}
		} finally {
			httpclient.close();
		}
		return respStr;
	}

	private static void setUploadParams(MultipartEntityBuilder multipartEntityBuilder, Map<String, Object> params) {
		if (params != null && params.size() > 0) {
			Set<String> keys = params.keySet();
			for (String key : keys) {
				multipartEntityBuilder.addPart(key, new StringBody(params.get(key).toString(), ContentType.TEXT_PLAIN));
			}
		}
	}

	/**
	 * 将返回结果转化为String
	 * 
	 * @param entity
	 * @return
	 * @throws Exception
	 */
	private static String getRespString(HttpEntity entity) throws Exception {
		if (entity == null) {
			return null;
		}
		InputStream is = entity.getContent();
		StringBuffer strBuf = new StringBuffer();
		byte[] buffer = new byte[4096];
		int r = 0;
		while ((r = is.read(buffer)) > 0) {
			strBuf.append(new String(buffer, 0, r, "UTF-8"));
		}
		return strBuf.toString();
	}

	public static Map<String, Object> toMap(HttpServletRequest request) {
		Map<String, Object> result = new HashMap<>();
		Map<String, String[]> reqMap = request.getParameterMap();
		if (reqMap == null || reqMap.size() == 0) {
			return null;
		}
		Object[] keys = reqMap.keySet().toArray();
		for (int i = 0; i < keys.length; i++) {
			result.put(keys[i].toString(), reqMap.get(keys[i].toString())[0]);
		}
		return result;
	}

	/**
	 * file to Base64
	 * @param file
	 * @return
	 * @throws Exception
	 */
	public static String fileToBase64(File file) throws Exception {
		FileInputStream inputFile = new FileInputStream(file);
		byte[] buffer = new byte[(int) file.length()];
		inputFile.read(buffer);
		inputFile.close();
		return new String(Base64.encodeBase64(buffer)) ;
	}
}
