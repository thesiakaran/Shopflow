package com.ShopFlow.Product_Service.controller;

import com.ShopFlow.Product_Service.dto.AuthResponse;
import com.ShopFlow.Product_Service.dto.LoginRequest;
import com.ShopFlow.Product_Service.dto.RegisterRequest;
import com.ShopFlow.Product_Service.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * POST /api/auth/register
     * Body: { "name": "Ravi", "email": "ravi@test.com", "password": "pass123", "phone": "9876543210" }
     * Returns: { "token": "eyJ...", "name": "Ravi", "email": "ravi@test.com", "role": "USER", "userId": 1 }
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * POST /api/auth/login
     * Body: { "email": "ravi@test.com", "password": "pass123" }
     * Returns: { "token": "eyJ...", "name": "Ravi", "email": "ravi@test.com", "role": "USER", "userId": 1 }
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
