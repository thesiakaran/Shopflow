package com.ShopFlow.Product_Service.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password; // BCrypt hashed

    private String phone;

    @Column(nullable = false)
    private String role = "USER"; // USER or ADMIN

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
