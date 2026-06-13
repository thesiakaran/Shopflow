package com.ShopFlow.Product_Service.controller;

import com.ShopFlow.Product_Service.dto.OrderRequest;
import com.ShopFlow.Product_Service.entity.Order;
import com.ShopFlow.Product_Service.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // ─────────────────────────────────────────────────────────────────────────
    // POST /api/orders/place
    // Places an order using all items currently in the user's cart
    // Body: {
    //   "paymentMethod": "COD",
    //   "shippingName": "Ravi Kumar",
    //   "shippingPhone": "9876543210",
    //   "shippingAddress": "123 MG Road",
    //   "shippingCity": "Bengaluru",
    //   "shippingState": "Karnataka",
    //   "shippingPincode": "560001"
    // }
    // Response: Full Order object with orderNumber, status, items, total
    // ─────────────────────────────────────────────────────────────────────────
    @PostMapping("/place")
    public ResponseEntity<?> placeOrder(@Valid @RequestBody OrderRequest request,
                                        Authentication authentication) {
        try {
            String email = authentication.getName();
            Order order = orderService.placeOrder(email, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(order);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GET /api/orders/my-orders
    // Returns all past orders for the logged-in user, sorted newest first
    // Response: [ { "id": 1, "orderNumber": "SF-20240525-8472", "status": "CONFIRMED", ... }, ... ]
    // ─────────────────────────────────────────────────────────────────────────
    @GetMapping("/my-orders")
    public ResponseEntity<List<Order>> getMyOrders(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(orderService.getMyOrders(email));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GET /api/orders/{id}
    // Returns a single order's full details (with all items)
    // Only returns the order if it belongs to the logged-in user
    // ─────────────────────────────────────────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Long id,
                                          Authentication authentication) {
        try {
            String email = authentication.getName();
            Order order = orderService.getOrderById(email, id);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
