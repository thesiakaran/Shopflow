package com.ShopFlow.Product_Service.Repository;

import com.ShopFlow.Product_Service.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<CartItem, Long> {

    // Get all cart items for a specific user
    List<CartItem> findByUserId(Long userId);

    // Check if a product is already in the user's cart
    Optional<CartItem> findByUserIdAndProductId(Long userId, String productId);

    // Clear entire cart for a user (called after order is placed)
    void deleteByUserId(Long userId);
}
