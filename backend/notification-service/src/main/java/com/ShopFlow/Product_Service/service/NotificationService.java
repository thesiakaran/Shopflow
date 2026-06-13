package com.ShopFlow.Product_Service.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class NotificationService {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @KafkaListener(topics = "order.placed", groupId = "notification-group")
    public void handleOrderPlaced(String message) {
        System.out.println("Notification Service received order.placed event: " + message);
        try {
            Map<String, Object> event = objectMapper.readValue(message, Map.class);
            String orderNumber = (String) event.get("orderNumber");
            String email = (String) event.get("email");
            Double amount = Double.valueOf(event.get("totalAmount").toString());

            System.out.println("\n==================================================");
            System.out.println("✉️  SENDING EMAIL INVOICE TO: " + email);
            System.out.println("Subject: Your Order " + orderNumber + " Has Been Placed!");
            System.out.println("Total Amount: ₹" + amount);
            System.out.println("Thank you for shopping with ShopFlow!");
            System.out.println("==================================================\n");
        } catch (Exception e) {
            System.err.println("Error sending email notification: " + e.getMessage());
        }
    }
}
