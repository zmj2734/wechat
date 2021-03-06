package com.gsw.wechat.dataSource;

import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.jdbc.DataSourceBuilder;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@EnableTransactionManagement
@Configuration
public class DataSourceConfig {
private static final Logger logger = LoggerFactory.getLogger(DataSourceConfig.class) ;
	
	@Bean(name = "mysqlDataSource")
	@Qualifier("mysqlDataSource")
	@Primary
    @ConfigurationProperties(prefix="spring.datasource.mysql")
    public  DataSource mysqlDataSource() {
		logger.debug("mysqlDataSource bean complete");
        return DataSourceBuilder.create().build();
    }
}
