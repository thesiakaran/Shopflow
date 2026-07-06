package com.ShopFlow.Product_Service.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.ShopFlow.Product_Service.Repository.UserRepository;
import com.ShopFlow.Product_Service.dto.AuthResponse;
import com.ShopFlow.Product_Service.dto.LoginRequest;
import com.ShopFlow.Product_Service.dto.RegisterRequest;
import com.ShopFlow.Product_Service.entity.User;
import com.ShopFlow.Product_Service.security.JwtUtil;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthService authService;

    private User mockUser;
    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setName("John Doe");
        mockUser.setEmail("john@example.com");
        mockUser.setPassword("encodedPassword");
        mockUser.setRole("USER");

        registerRequest = new RegisterRequest();
        registerRequest.setName("John Doe");
        registerRequest.setEmail("john@example.com");
        registerRequest.setPassword("rawPassword");
        registerRequest.setPhone("1234567890");

        loginRequest = new LoginRequest();
        loginRequest.setEmail("john@example.com");
        loginRequest.setPassword("rawPassword");
    }

    @Test
    void testRegister_Success() {
        // Arrange
        when(userRepository.existsByEmail(registerRequest.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(registerRequest.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(mockUser);
        when(jwtUtil.generateToken(mockUser.getEmail())).thenReturn("dummyToken");

        // Act
        AuthResponse response = authService.register(registerRequest);

        // Assert
        assertNotNull(response);
        assertEquals("dummyToken", response.getToken());
        assertEquals("John Doe", response.getName());
        assertEquals("USER", response.getRole());

        verify(userRepository, times(1)).existsByEmail(registerRequest.getEmail());
        verify(userRepository, times(1)).save(any(User.class));
        verify(jwtUtil, times(1)).generateToken(mockUser.getEmail());
    }

    @Test
    void testRegister_EmailAlreadyExists() {
        // Arrange
        when(userRepository.existsByEmail(registerRequest.getEmail())).thenReturn(true);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.register(registerRequest);
        });

        assertEquals("Email already registered. Please login.", exception.getMessage());
        verify(userRepository, times(1)).existsByEmail(registerRequest.getEmail());
        verify(userRepository, never()).save(any(User.class));
        verify(jwtUtil, never()).generateToken(anyString());
    }

    @Test
    void testLogin_Success() {
        // Arrange
        when(userRepository.findByEmail(loginRequest.getEmail())).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches(loginRequest.getPassword(), mockUser.getPassword())).thenReturn(true);
        when(jwtUtil.generateToken(mockUser.getEmail())).thenReturn("dummyToken");

        // Act
        AuthResponse response = authService.login(loginRequest);

        // Assert
        assertNotNull(response);
        assertEquals("dummyToken", response.getToken());
        assertEquals("John Doe", response.getName());

        verify(userRepository, times(1)).findByEmail(loginRequest.getEmail());
        verify(passwordEncoder, times(1)).matches(loginRequest.getPassword(), mockUser.getPassword());
        verify(jwtUtil, times(1)).generateToken(mockUser.getEmail());
    }

    @Test
    void testLogin_UserNotFound() {
        // Arrange
        when(userRepository.findByEmail(loginRequest.getEmail())).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.login(loginRequest);
        });

        assertEquals("No account found with this email.", exception.getMessage());
        verify(userRepository, times(1)).findByEmail(loginRequest.getEmail());
        verify(passwordEncoder, never()).matches(anyString(), anyString());
        verify(jwtUtil, never()).generateToken(anyString());
    }

    @Test
    void testLogin_IncorrectPassword() {
        // Arrange
        when(userRepository.findByEmail(loginRequest.getEmail())).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches(loginRequest.getPassword(), mockUser.getPassword())).thenReturn(false);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.login(loginRequest);
        });

        assertEquals("Incorrect password. Please try again.", exception.getMessage());
        verify(userRepository, times(1)).findByEmail(loginRequest.getEmail());
        verify(passwordEncoder, times(1)).matches(loginRequest.getPassword(), mockUser.getPassword());
        verify(jwtUtil, never()).generateToken(anyString());
    }
}
