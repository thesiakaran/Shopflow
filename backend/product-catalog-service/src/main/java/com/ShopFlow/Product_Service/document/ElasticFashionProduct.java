package com.ShopFlow.Product_Service.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import lombok.Data;

@Data
@Document(indexName = "fashion", createIndex = false)
public class ElasticFashionProduct {

    @Id
    private String mongoID;
    
    @Field(name = "id")
    private Integer fashionId;
    
    @Field(type = FieldType.Keyword)
    private String gender;
    
    @Field(type = FieldType.Keyword)
    private String masterCategory;
    
    @Field(type = FieldType.Keyword)
    private String subCategory;
    
    @Field(type = FieldType.Text, analyzer = "standard")
    private String articleType;
    
    @Field(type = FieldType.Keyword)
    private String baseColour;
    
    private String season;
    private String year;
    private String usage;
    
    @Field(type = FieldType.Text, analyzer = "standard")
    private String productDisplayName;
    
    private Double price;
    private String imageUrl;
}
