package com.ShopFlow.Product_Service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {

    private String token;   // JWT token
    private String name;    // User's full name
    private String email;   // User's email
    private String role;    // USER or ADMIN
    private Long userId;    // User's ID
}
