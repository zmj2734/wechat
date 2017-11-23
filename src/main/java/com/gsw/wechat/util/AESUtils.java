package com.gsw.wechat.util;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import sun.misc.BASE64Decoder;

public class AESUtils {

	private static String AES_KEY = "whdiewjdo32e9232";
	private static String IV = "rh3diwjdiwjdidji";

	public static void main(String args[]) throws Exception {
		String cc = encrypt("287382376e3287ey328dh2id23ifdj32ododj32do2dj1od");
		//cc = cc.replaceAll("\r\n", ""); 
		System.out.println(cc);
		System.out.println("" + encrypt("287382376e3287ey328dh2id23ifdj32ododj32do2dj1od"));
		System.out.println("decrypted: " + desEncrypt().trim());
		System.out.println(System.currentTimeMillis());
	}

	public static String encrypt(String content) throws Exception {
		try {
			
			
			Cipher cipher = Cipher.getInstance("AES/CBC/NoPadding");
			int blockSize = cipher.getBlockSize();
			byte[] dataBytes = content.getBytes();
			int plaintextLength = dataBytes.length;
			if (plaintextLength % blockSize != 0) {
				plaintextLength = plaintextLength
						+ (blockSize - (plaintextLength % blockSize));
			}
			byte[] plaintext = new byte[plaintextLength];
			System.arraycopy(dataBytes, 0, plaintext, 0, dataBytes.length);
			SecretKeySpec keyspec = new SecretKeySpec(AES_KEY.getBytes(), "AES");
			IvParameterSpec ivspec = new IvParameterSpec(IV.getBytes());
			cipher.init(Cipher.ENCRYPT_MODE, keyspec, ivspec);
			byte[] encrypted = cipher.doFinal(plaintext);
			return new sun.misc.BASE64Encoder().encode(encrypted);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	public static String desEncrypt() throws Exception {
		String encrypted = encrypt("287382376e3287ey328dh2id23ifdj32ododj32do2dj1od");
		try {
			String data = encrypted;
			
			byte[] encrypted1 = new BASE64Decoder().decodeBuffer(data);
			Cipher cipher = Cipher.getInstance("AES/CBC/NoPadding");
			SecretKeySpec keyspec = new SecretKeySpec(AES_KEY.getBytes(), "AES");
			IvParameterSpec ivspec = new IvParameterSpec(IV.getBytes());
			cipher.init(Cipher.DECRYPT_MODE, keyspec, ivspec);
			byte[] original = cipher.doFinal(encrypted1);
			String originalString = new String(original);
			return originalString;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
}