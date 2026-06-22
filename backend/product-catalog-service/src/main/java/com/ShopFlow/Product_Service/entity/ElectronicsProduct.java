package com.ShopFlow.Product_Service.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Index;
import lombok.Data;

@Data
@Entity
@Table(name = "electronics", indexes = {
    @Index(name = "idx_electronics_category", columnList = "category"),
    @Index(name = "idx_electronics_brand", columnList = "brand"),
    @Index(name = "idx_electronics_name", columnList = "name")
})
public class ElectronicsProduct {

    @Id
    private String id;
    private String name;
    private String brand;
    private String category;
    
    @Column(columnDefinition = "TEXT")
    private String imageUrl;
    
    private Double price;
    private String condition;
    private String isSale;
    private String weight;
    private String manufacturer;
}