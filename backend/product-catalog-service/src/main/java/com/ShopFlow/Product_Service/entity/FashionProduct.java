package com.ShopFlow.Product_Service.entity;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import lombok.Data;

@Data
@Document(collection = "fashion")
public class FashionProduct {

    @Id
    private String mongoID;
    private Integer id;
    
    @Indexed
    private String gender;
    
    @Indexed
    private String masterCategory;
    
    @Indexed
    private String subCategory;
    
    private String articleType;
    private String baseColour;
    private String season;
    private String year;
    private String usage;
    
    @Indexed
    private String productDisplayName;
    
    private Double price;
    private String imageUrl;
}