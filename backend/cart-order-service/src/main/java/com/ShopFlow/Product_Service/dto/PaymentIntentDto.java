package com.shopflow.Product_Service.dto;

import lombok.Data;

@Data
public class PaymentIntentDto {
    private Long amount; // Amount in cents (e.g., 5000 = $50.00)
    private String currency; // e.g., "usd" or "inr"
}
