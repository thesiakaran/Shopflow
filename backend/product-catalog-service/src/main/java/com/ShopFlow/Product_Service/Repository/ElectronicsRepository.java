package com.ShopFlow.Product_Service.Repository;

import com.ShopFlow.Product_Service.entity.ElectronicsProduct;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ElectronicsRepository extends JpaRepository<ElectronicsProduct, String> {

    @Query("SELECT e FROM ElectronicsProduct e WHERE " +
           "(:category IS NULL OR :category = '' OR e.category = :category) AND " +
           "(:search IS NULL OR :search = '' OR LOWER(e.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(e.brand) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<ElectronicsProduct> searchProducts(
            @Param("category") String category,
            @Param("search") String search,
            Pageable pageable
    );

    Page<ElectronicsProduct> findByCategory(String category, Pageable pageable);

    @Query("SELECT DISTINCT e.category FROM ElectronicsProduct e WHERE e.category IS NOT NULL ORDER BY e.category")
    List<String> findDistinctCategories();
}