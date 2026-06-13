package com.ShopFlow.Product_Service.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Which user placed this order
    private Long userId;

    // Unique human-readable order number e.g. SF-20240525-8472
    @Column(unique = true)
    private String orderNumber;

    // Order lifecycle: CONFIRMED → SHIPPED → DELIVERED
    private String status = "CONFIRMED";

    // Payment info
    private Double totalAmount;
    private String paymentMethod;  // "CARD" or "COD"
    private String paymentStatus;  // "PAID" or "PENDING"

    // When the order was placed
    private LocalDateTime placedAt = LocalDateTime.now();

    // ── Shipping Address ──────────────────────────────────────
    private String shippingName;
    private String shippingPhone;
    private String shippingAddress;
    private String shippingCity;
    private String shippingState;
    private String shippingPincode;

    // ── Items in this order ───────────────────────────────────
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "order_id")
    private List<OrderItem> items;
}
