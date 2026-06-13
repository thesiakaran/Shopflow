package com.ShopFlow.Product_Service;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.TextIndexDefinition;

@SpringBootApplication
public class ProductCatalogServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProductCatalogServiceApplication.class, args);
	}

	@Bean
	public CommandLineRunner initDatabase(MongoTemplate mongoTemplate) {
		return args -> {
			TextIndexDefinition textIndex = new TextIndexDefinition.TextIndexDefinitionBuilder()
				.onField("productDisplayName")
				.onField("articleType")
				.onField("baseColour")
				.build();
				
			mongoTemplate.indexOps("fashion").ensureIndex(textIndex);
		};
	}
}
