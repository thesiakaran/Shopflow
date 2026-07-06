package com.ShopFlow.Product_Service.security;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

public class JwtUtilTest {

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        // A standard 256-bit secret string for HMAC-SHA256
        String mockSecret = "this_is_a_very_long_mock_secret_key_for_testing_purposes";
        long mockExpiration = 3600000; // 1 hour

        ReflectionTestUtils.setField(jwtUtil, "secret", mockSecret);
        ReflectionTestUtils.setField(jwtUtil, "expiration", mockExpiration);
    }

    @Test
    void testGenerateAndExtractToken() {
        // Arrange
        String email = "test@example.com";

        // Act
        String token = jwtUtil.generateToken(email);

        // Assert
        assertNotNull(token);
        assertFalse(token.isEmpty());

        String extractedEmail = jwtUtil.extractEmail(token);
        assertEquals(email, extractedEmail);
    }

    @Test
    void testIsTokenValid_Success() {
        // Arrange
        String email = "test@example.com";
        String token = jwtUtil.generateToken(email);

        // Act
        boolean isValid = jwtUtil.isTokenValid(token);

        // Assert
        assertTrue(isValid);
    }

    @Test
    void testIsTokenValid_Failure_InvalidSignature() {
        // Arrange
        String email = "test@example.com";
        String token = jwtUtil.generateToken(email);
        
        // Tamper with the token
        String tamperedToken = token + "xyz";

        // Act
        boolean isValid = jwtUtil.isTokenValid(tamperedToken);

        // Assert
        assertFalse(isValid);
    }
}
