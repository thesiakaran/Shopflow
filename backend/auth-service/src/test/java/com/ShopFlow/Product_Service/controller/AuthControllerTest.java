package com.ShopFlow.Product_Service.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.ShopFlow.Product_Service.dto.AuthResponse;
import com.ShopFlow.Product_Service.dto.LoginRequest;
import com.ShopFlow.Product_Service.dto.RegisterRequest;
import com.ShopFlow.Product_Service.service.AuthService;

@ExtendWith(MockitoExtension.class)
public class AuthControllerTest {

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private AuthResponse authResponse;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest();
        registerRequest.setName("John Doe");
        registerRequest.setEmail("john@example.com");
        registerRequest.setPassword("rawPassword");
        registerRequest.setPhone("1234567890");

        loginRequest = new LoginRequest();
        loginRequest.setEmail("john@example.com");
        loginRequest.setPassword("rawPassword");

        authResponse = new AuthResponse("dummyToken", "John Doe", "john@example.com", "USER", 1L);
    }

    @Test
    void testRegister_Success() {
        // Arrange
        when(authService.register(any(RegisterRequest.class))).thenReturn(authResponse);

        // Act
        ResponseEntity<?> responseEntity = authController.register(registerRequest);

        // Assert
        assertNotNull(responseEntity);
        assertEquals(HttpStatus.CREATED, responseEntity.getStatusCode());
        assertEquals(authResponse, responseEntity.getBody());

        verify(authService, times(1)).register(any(RegisterRequest.class));
    }

    @Test
    void testRegister_Conflict() {
        // Arrange
        when(authService.register(any(RegisterRequest.class)))
                .thenThrow(new RuntimeException("Email already registered. Please login."));

        // Act
        ResponseEntity<?> responseEntity = authController.register(registerRequest);

        // Assert
        assertNotNull(responseEntity);
        assertEquals(HttpStatus.CONFLICT, responseEntity.getStatusCode());
        
        Map<?, ?> body = (Map<?, ?>) responseEntity.getBody();
        assertNotNull(body);
        assertEquals("Email already registered. Please login.", body.get("error"));

        verify(authService, times(1)).register(any(RegisterRequest.class));
    }

    @Test
    void testLogin_Success() {
        // Arrange
        when(authService.login(any(LoginRequest.class))).thenReturn(authResponse);

        // Act
        ResponseEntity<?> responseEntity = authController.login(loginRequest);

        // Assert
        assertNotNull(responseEntity);
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals(authResponse, responseEntity.getBody());

        verify(authService, times(1)).login(any(LoginRequest.class));
    }

    @Test
    void testLogin_Unauthorized() {
        // Arrange
        when(authService.login(any(LoginRequest.class)))
                .thenThrow(new RuntimeException("Incorrect password. Please try again."));

        // Act
        ResponseEntity<?> responseEntity = authController.login(loginRequest);

        // Assert
        assertNotNull(responseEntity);
        assertEquals(HttpStatus.UNAUTHORIZED, responseEntity.getStatusCode());
        
        Map<?, ?> body = (Map<?, ?>) responseEntity.getBody();
        assertNotNull(body);
        assertEquals("Incorrect password. Please try again.", body.get("error"));

        verify(authService, times(1)).login(any(LoginRequest.class));
    }
}
