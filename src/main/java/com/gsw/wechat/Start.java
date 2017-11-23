package com.gsw.wechat ;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.cache.annotation.EnableCaching;

/**
 * Start
 */
@SpringBootApplication
@EnableCaching
public class Start extends SpringBootServletInitializer{
    public static void main( String[] args )
    {
    	 SpringApplication.run(Start.class, args);
    }
}
