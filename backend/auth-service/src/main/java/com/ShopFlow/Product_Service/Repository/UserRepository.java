package com.ShopFlow.Product_Service.Repository;

import com.ShopFlow.Product_Service.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Find user by email (used during login)
    Optional<User> findByEmail(String email);

    // Check if email already registered (used during register)
    boolean existsByEmail(String email);
}
