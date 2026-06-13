package com.ShopFlow.Product_Service.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "cart_items")
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Which user owns this cart item
    private Long userId;

    // Product info (stored so cart works even if product DB changes)
    private String productId;
    private String productName;
    
    @Column(columnDefinition = "TEXT")
    private String productImage;
    
    private Double price;
    private Integer quantity;

    // "electronics" or "fashion"
    private String category;
}
