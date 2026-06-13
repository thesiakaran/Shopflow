package com.ShopFlow.Product_Service.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Snapshot of the product at the time of order
    private String productId;
    private String productName;
    
    @Column(columnDefinition = "TEXT")
    private String productImage;
    
    private Double price;
    private Integer quantity;
    private String category;

    // Subtotal for this line item (price × quantity)
    private Double subtotal;
}
