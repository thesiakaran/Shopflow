package com.ShopFlow.Product_Service.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Catches validation errors (@Valid failures) globally and returns
 * a clean JSON response that the React frontend can parse.
 *
 * Without this, Spring returns a raw 400 body that doesn't contain
 * the "error" or "fields" keys the frontend looks for, so the user
 * just sees "Registration failed. Please try again." with no details.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(MethodArgumentNotValidException ex) {

        // Collect field-level errors: { "email": "Please enter a valid email", "phone": "Phone number must be 10 digits" }
        Map<String, String> fieldErrors = ex.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(
                        fe -> fe.getField(),
                        fe -> fe.getDefaultMessage(),
                        (a, b) -> a, // keep first if duplicate fields
                        LinkedHashMap::new
                ));

        // Build a single human-readable summary for the "error" key
        String summary = fieldErrors.values().stream()
                .collect(Collectors.joining(". "));

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("error", summary);
        body.put("fields", fieldErrors);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }
}
