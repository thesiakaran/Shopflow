package com.ShopFlow.Product_Service.entity;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Data
@Document(collection = "fashion")
public class FashionProduct {

    @Id
    private String mongoID;
    private Integer id;
    private String gender;
    private String masterCategory;
    private String subCategory;
    private String articleType;
    private String baseColour;
    private String season;
    private String year;
    private String usage;
    private String productDisplayName;
    private Double price;
    private String imageUrl;
}