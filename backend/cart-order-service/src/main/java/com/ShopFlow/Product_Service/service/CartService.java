package com.ShopFlow.Product_Service.service;

import com.ShopFlow.Product_Service.Repository.CartRepository;
import com.ShopFlow.Product_Service.Repository.UserRepository;
import com.ShopFlow.Product_Service.dto.CartRequest;
import com.ShopFlow.Product_Service.entity.CartItem;
import com.ShopFlow.Product_Service.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;

    // ─── Helper: Get User by Email ────────────────────────────
    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ─── GET CART ─────────────────────────────────────────────
    // Returns all items in the logged-in user's cart
    public List<CartItem> getCart(String email) {

        User user = getUserByEmail(email);
        return cartRepository.findByUserId(user.getId());
    }

    // ─── ADD TO CART ──────────────────────────────────────────
    // If product already in cart → increase quantity
    // If product not in cart → add new cart item
    public CartItem addToCart(String email, CartRequest request) {
        User user = getUserByEmail(email);

        // Check if product already exists in cart
        Optional<CartItem> existing = cartRepository
                .findByUserIdAndProductId(user.getId(), request.getProductId());

        if (existing.isPresent()) {
            // Product already in cart — just increase quantity
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            return cartRepository.save(item);
        }

        // Product not in cart — create new cart item
        CartItem newItem = new CartItem();
        newItem.setUserId(user.getId());
        newItem.setProductId(request.getProductId());
        newItem.setProductName(request.getProductName());
        newItem.setProductImage(request.getProductImage());
        newItem.setPrice(request.getPrice());
        newItem.setQuantity(request.getQuantity());
        newItem.setCategory(request.getCategory());

        return cartRepository.save(newItem);
    }

    // ─── UPDATE QUANTITY ──────────────────────────────────────
    // Updates the quantity of a specific cart item
    public CartItem updateQuantity(String email, Long cartItemId, Integer quantity) {
        User user = getUserByEmail(email);

        CartItem item = cartRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        // Security check: make sure this item belongs to the logged-in user
        if (!item.getUserId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized: This cart item doesn't belong to you");
        }

        // If quantity is 0 or less, remove the item
        if (quantity <= 0) {
            cartRepository.delete(item);
            return null;
        }

        item.setQuantity(quantity);
        return cartRepository.save(item);
    }

    // ─── REMOVE ITEM ──────────────────────────────────────────
    // Removes a single item from the cart
    public void removeItem(String email, Long cartItemId) {
        User user = getUserByEmail(email);

        CartItem item = cartRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        // Security check: make sure this item belongs to the logged-in user
        if (!item.getUserId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized: This cart item doesn't belong to you");
        }

        cartRepository.delete(item);
    }

    // ─── CLEAR CART ───────────────────────────────────────────
    // Removes ALL items from the user's cart (called after order is placed)
    @Transactional
    public void clearCart(String email) {
        User user = getUserByEmail(email);
        cartRepository.deleteByUserId(user.getId());
    }

    // ─── CART ITEM COUNT ──────────────────────────────────────
    // Returns total number of items in cart (for navbar badge)
    public int getCartCount(String email) {
        User user = getUserByEmail(email);
        return cartRepository.findByUserId(user.getId())
                .stream()
                .mapToInt(CartItem::getQuantity)
                .sum();
    }
}
