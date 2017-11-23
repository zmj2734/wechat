package com.gsw.wechat.dataSource;

import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class JdbcTemplateConfig {
private static final Logger logger = LoggerFactory.getLogger(JdbcTemplateConfig.class) ;
	
	@Bean(name = "mysqlJdbcTemplate")
    public  JdbcTemplate mysqlJdbcTemplate(@Qualifier("mysqlDataSource") DataSource dataSource) {
		logger.debug("mysqlJdbcTemplate bean complete");
        return new JdbcTemplate(dataSource);
    }
}
