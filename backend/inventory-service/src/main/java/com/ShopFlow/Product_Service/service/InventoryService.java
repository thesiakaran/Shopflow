package com.ShopFlow.Product_Service.service;

import com.ShopFlow.Product_Service.Repository.InventoryRepository;
import com.ShopFlow.Product_Service.entity.Inventory;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @KafkaListener(topics = "order.placed", groupId = "inventory-group")
    @Transactional
    public void handleOrderPlaced(String message) {
        System.out.println("Inventory Service received order.placed event: " + message);
        try {
            // Parse JSON message
            Map<String, Object> event = objectMapper.readValue(message, Map.class);
            List<Map<String, Object>> items = (List<Map<String, Object>>) event.get("items");
            
            for (Map<String, Object> item : items) {
                String productId = (String) item.get("productId");
                Integer quantity = (Integer) item.get("quantity");
                
                deductStock(productId, quantity);
            }
        } catch (Exception e) {
            System.err.println("Error processing inventory deduction: " + e.getMessage());
        }
    }

    private void deductStock(String productId, int quantity) {
        Inventory inventory = inventoryRepository.findByProductId(productId)
                .orElseGet(() -> {
                    // Auto-create stock if not exists for demo (starts with 100 items)
                    Inventory newInv = new Inventory();
                    newInv.setProductId(productId);
                    newInv.setStock(100);
                    return inventoryRepository.save(newInv);
                });

        if (inventory.getStock() < quantity) {
            System.err.println("Insufficient stock for product " + productId + ". Available: " + inventory.getStock() + ", Required: " + quantity);
            return;
        }

        inventory.setStock(inventory.getStock() - quantity);
        inventoryRepository.save(inventory);
        System.out.println("Successfully deducted " + quantity + " units from product " + productId + ". New Stock: " + inventory.getStock());
    }
}
