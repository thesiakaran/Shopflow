package com.ShopFlow.Product_Service.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data // Lombok automatically writes your getters and setters!
@Entity
@Table(name = "electronics")
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