package com.ShopFlow.Product_Service.Repository;

import com.ShopFlow.Product_Service.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Get all orders for a user, sorted newest first
    List<Order> findByUserIdOrderByPlacedAtDesc(Long userId);

    // Get a specific order — also checks it belongs to the user (security)
    Optional<Order> findByIdAndUserId(Long id, Long userId);
}
