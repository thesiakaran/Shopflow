package com.ShopFlow.Product_Service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class OrderRequest {

    // Payment Method
    @NotBlank(message = "Payment method is required")
    @Pattern(regexp = "CARD|COD", message = "Payment method must be CARD or COD")
    private String paymentMethod;

    // ── Shipping Address ──────────────────────────────────────
    @NotBlank(message = "Recipient name is required")
    private String shippingName;

    @NotBlank(message = "Phone number is required")
    @Size(min = 10, max = 10, message = "Phone number must be 10 digits")
    private String shippingPhone;

    @NotBlank(message = "Address is required")
    private String shippingAddress;

    @NotBlank(message = "City is required")
    private String shippingCity;

    @NotBlank(message = "State is required")
    private String shippingState;

    @NotBlank(message = "Pincode is required")
    @Size(min = 6, max = 6, message = "Pincode must be 6 digits")
    private String shippingPincode;
}
