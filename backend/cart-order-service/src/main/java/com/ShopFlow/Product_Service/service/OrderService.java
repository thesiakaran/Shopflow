package com.ShopFlow.Product_Service.service;

import com.ShopFlow.Product_Service.Repository.CartRepository;
import com.ShopFlow.Product_Service.Repository.OrderRepository;
import com.ShopFlow.Product_Service.Repository.UserRepository;
import com.ShopFlow.Product_Service.dto.OrderRequest;
import com.ShopFlow.Product_Service.entity.CartItem;
import com.ShopFlow.Product_Service.entity.Order;
import com.ShopFlow.Product_Service.entity.OrderItem;
import com.ShopFlow.Product_Service.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.kafka.core.KafkaTemplate;
import java.util.Map;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    // ─── Helper: Get User by Email ────────────────────────────
    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ─── Generate Unique Order Number ─────────────────────────
    // Format: SF-20240525-4829
    private String generateOrderNumber() {
        String date = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        int random = new Random().nextInt(9000) + 1000; // 4-digit random number
        return "SF-" + date + "-" + random;
    }

    // ─── PLACE ORDER ──────────────────────────────────────────
    // Full flow:
    // 1. Get user's cart items
    // 2. Validate cart is not empty
    // 3. Convert cart items → order items
    // 4. Calculate total amount
    // 5. Create & save the order
    // 6. Clear the cart
    // 7. Return the saved order
    @Transactional
    public Order placeOrder(String email, OrderRequest request) {
        User user = getUserByEmail(email);

        // Step 1: Get cart items
        List<CartItem> cartItems = cartRepository.findByUserId(user.getId());

        // Step 2: Validate cart is not empty
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty. Add items before placing an order.");
        }

        // Step 3: Convert cart items → order items
        List<OrderItem> orderItems = cartItems.stream().map(cartItem -> {
            OrderItem item = new OrderItem();
            item.setProductId(cartItem.getProductId());
            item.setProductName(cartItem.getProductName());
            item.setProductImage(cartItem.getProductImage());
            item.setPrice(cartItem.getPrice());
            item.setQuantity(cartItem.getQuantity());
            item.setCategory(cartItem.getCategory());
            item.setSubtotal(cartItem.getPrice() * cartItem.getQuantity());
            return item;
        }).collect(Collectors.toList());

        // Step 4: Calculate total amount
        double total = orderItems.stream()
                .mapToDouble(OrderItem::getSubtotal)
                .sum();

        // Add delivery charge if total < 999
        double deliveryCharge = total < 999 ? 49.0 : 0.0;
        double finalTotal = total + deliveryCharge;

        // Step 5: Build the Order
        Order order = new Order();
        order.setUserId(user.getId());
        order.setOrderNumber(generateOrderNumber());
        order.setStatus("CONFIRMED");
        order.setTotalAmount(finalTotal);
        order.setPaymentMethod(request.getPaymentMethod());
        order.setPaymentStatus(request.getPaymentMethod().equals("CARD") ? "PAID" : "PENDING");
        order.setShippingName(request.getShippingName());
        order.setShippingPhone(request.getShippingPhone());
        order.setShippingAddress(request.getShippingAddress());
        order.setShippingCity(request.getShippingCity());
        order.setShippingState(request.getShippingState());
        order.setShippingPincode(request.getShippingPincode());
        order.setItems(orderItems);

        // Step 6: Save order to database
        Order savedOrder = orderRepository.save(order);

        // Step 7: Clear the user's cart
        cartRepository.deleteByUserId(user.getId());

        // Step 8: Publish order.placed event to Kafka
        try {
            Map<String, Object> orderEvent = Map.of(
                "orderNumber", savedOrder.getOrderNumber(),
                "email", email,
                "totalAmount", savedOrder.getTotalAmount(),
                "items", savedOrder.getItems().stream().map(item -> Map.of(
                    "productId", item.getProductId(),
                    "quantity", item.getQuantity()
                )).collect(Collectors.toList())
            );
            kafkaTemplate.send("order.placed", orderEvent);
            System.out.println("Successfully published order.placed event to Kafka for order: " + savedOrder.getOrderNumber());
        } catch (Exception e) {
            System.err.println("Failed to publish Kafka event: " + e.getMessage());
        }

        return savedOrder;
    }

    // ─── GET MY ORDERS ────────────────────────────────────────
    // Returns all past orders for the logged-in user, newest first
    public List<Order> getMyOrders(String email) {
        User user = getUserByEmail(email);
        return orderRepository.findByUserIdOrderByPlacedAtDesc(user.getId());
    }

    // ─── GET ORDER BY ID ──────────────────────────────────────
    // Returns a single order — only if it belongs to the logged-in user
    public Order getOrderById(String email, Long orderId) {
        User user = getUserByEmail(email);
        return orderRepository.findByIdAndUserId(orderId, user.getId())
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }
}
