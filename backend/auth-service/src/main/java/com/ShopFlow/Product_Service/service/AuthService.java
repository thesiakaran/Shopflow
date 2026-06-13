package com.ShopFlow.Product_Service.service;

import com.ShopFlow.Product_Service.Repository.UserRepository;
import com.ShopFlow.Product_Service.dto.AuthResponse;
import com.ShopFlow.Product_Service.dto.LoginRequest;
import com.ShopFlow.Product_Service.dto.RegisterRequest;
import com.ShopFlow.Product_Service.entity.User;
import com.ShopFlow.Product_Service.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    /**
     * Register a new user
     * - Check if email already exists
     * - Hash the password using BCrypt
     * - Save user to PostgreSQL
     * - Generate JWT token
     * - Return token + user info
     */
    public AuthResponse register(RegisterRequest request) {

        // Check duplicate email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered. Please login.");
        }

        // Build new User entity
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // BCrypt hash
        user.setPhone(request.getPhone());
        user.setRole("USER");

        // Save to PostgreSQL
        User savedUser = userRepository.save(user);

        // Generate JWT
        String token = jwtUtil.generateToken(savedUser.getEmail());

        return new AuthResponse(token, savedUser.getName(), savedUser.getEmail(), savedUser.getRole(), savedUser.getId());
    }

    /**
     * Login an existing user
     * - Find user by email
     * - Verify BCrypt password
     * - Generate JWT token
     * - Return token + user info
     */
    public AuthResponse login(LoginRequest request) {

        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("No account found with this email."));

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Incorrect password. Please try again.");
        }

        // Generate JWT
        String token = jwtUtil.generateToken(user.getEmail());

        return new AuthResponse(token, user.getName(), user.getEmail(), user.getRole(), user.getId());
    }
}
