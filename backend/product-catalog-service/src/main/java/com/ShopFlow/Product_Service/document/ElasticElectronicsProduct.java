package com.ShopFlow.Product_Service.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import lombok.Data;

@Data
@Document(indexName = "electronics")
public class ElasticElectronicsProduct {

    @Id
    private String id;
    
    @Field(type = FieldType.Text, analyzer = "standard")
    private String name;
    
    @Field(type = FieldType.Text, analyzer = "standard")
    private String brand;
    
    @Field(type = FieldType.Keyword)
    private String category;
    
    private String imageUrl;
    private Double price;
    private String condition;
    private String isSale;
    private String weight;
    private String manufacturer;
}
