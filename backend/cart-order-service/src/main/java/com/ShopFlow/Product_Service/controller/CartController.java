package com.ShopFlow.Product_Service.controller;

import com.ShopFlow.Product_Service.dto.CartRequest;
import com.ShopFlow.Product_Service.entity.CartItem;
import com.ShopFlow.Product_Service.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    // ─────────────────────────────────────────────────────────────────────────
    // GET /api/cart
    // Returns all cart items for the logged-in user
    // Example Response: [ { "id": 1, "productName": "iPhone 15", "price": 79999, "quantity": 1 }, ... ]
    // ─────────────────────────────────────────────────────────────────────────
    @GetMapping
    public ResponseEntity<List<CartItem>> getCart(Authentication authentication) {
        String email = authentication.getName(); // Email from JWT token
        return ResponseEntity.ok(cartService.getCart(email));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // POST /api/cart/add
    // Adds a product to cart (or increases quantity if already exists)
    // Body: { "productId": "E001", "productName": "iPhone 15", "price": 79999, "quantity": 1, "category": "electronics" }
    // ─────────────────────────────────────────────────────────────────────────
    @PostMapping("/add")
    public ResponseEntity<CartItem> addToCart(@Valid @RequestBody CartRequest request,
                                              Authentication authentication) {
        String email = authentication.getName();
        CartItem item = cartService.addToCart(email, request);
        return ResponseEntity.ok(item);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PUT /api/cart/{id}
    // Updates the quantity of a specific cart item
    // Body: { "quantity": 3 }
    // ─────────────────────────────────────────────────────────────────────────
    @PutMapping("/{id}")
    public ResponseEntity<?> updateQuantity(@PathVariable Long id,
                                            @RequestBody Map<String, Integer> body,
                                            Authentication authentication) {
        String email = authentication.getName();
        Integer quantity = body.get("quantity");

        if (quantity == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Quantity is required"));
        }

        CartItem updated = cartService.updateQuantity(email, id, quantity);

        if (updated == null) {
            // Item was removed because quantity became 0
            return ResponseEntity.ok(Map.of("message", "Item removed from cart"));
        }

        return ResponseEntity.ok(updated);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // DELETE /api/cart/{id}
    // Removes a single item from the cart
    // ─────────────────────────────────────────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> removeItem(@PathVariable Long id,Authentication authentication) {
        String email = authentication.getName();
        cartService.removeItem(email, id);
        return ResponseEntity.ok(Map.of("message", "Item removed from cart successfully"));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // DELETE /api/cart/clear
    // Clears ALL items from the cart (used after placing an order)
    // ─────────────────────────────────────────────────────────────────────────
    @DeleteMapping("/clear")
    public ResponseEntity<Map<String, String>> clearCart(Authentication authentication) {
        String email = authentication.getName();
        cartService.clearCart(email);
        return ResponseEntity.ok(Map.of("message", "Cart cleared successfully"));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GET /api/cart/count
    // Returns total item count (for Navbar cart badge)
    // Example Response: { "count": 3 }
    // ─────────────────────────────────────────────────────────────────────────
    @GetMapping("/count")
    public ResponseEntity<Map<String, Integer>> getCartCount(Authentication authentication) {
        String email = authentication.getName();
        int count = cartService.getCartCount(email);
        return ResponseEntity.ok(Map.of("count", count));
    }
}
