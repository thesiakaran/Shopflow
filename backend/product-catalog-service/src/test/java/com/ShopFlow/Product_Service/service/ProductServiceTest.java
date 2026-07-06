package com.ShopFlow.Product_Service.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.MongoTemplate;

import com.ShopFlow.Product_Service.Repository.ElasticElectronicsRepository;
import com.ShopFlow.Product_Service.Repository.ElasticFashionRepository;
import com.ShopFlow.Product_Service.Repository.ElectronicsRepository;
import com.ShopFlow.Product_Service.Repository.FashionRepository;
import com.ShopFlow.Product_Service.entity.ElectronicsProduct;

@ExtendWith(MockitoExtension.class)
public class ProductServiceTest {

    @Mock
    private ElectronicsRepository electronicsRepository;

    @Mock
    private FashionRepository fashionRepository;

    @Mock
    private ElasticElectronicsRepository elasticElectronicsRepository;

    @Mock
    private ElasticFashionRepository elasticFashionRepository;

    @Mock
    private MongoTemplate mongoTemplate;

    @InjectMocks
    private ProductService productService;

    private ElectronicsProduct mockProduct;

    @BeforeEach
    void setUp() {
        mockProduct = new ElectronicsProduct();
        mockProduct.setId("elec-123");
        mockProduct.setName("Test Laptop");
        mockProduct.setCategory("Laptops");
        mockProduct.setPrice(999.99);
    }

    @Test
    void testGetElectronicsById_Found() {
        // Arrange
        String productId = "elec-123";
        when(electronicsRepository.findById(productId)).thenReturn(Optional.of(mockProduct));

        // Act
        Optional<ElectronicsProduct> result = productService.getElectronicsById(productId);

        // Assert
        assertTrue(result.isPresent(), "Product should be found");
        assertEquals("Test Laptop", result.get().getName(), "Product name should match");
        assertEquals(999.99, result.get().getPrice(), "Product price should match");
        
        // Verify that the repository method was called exactly once
        verify(electronicsRepository, times(1)).findById(productId);
    }

    @Test
    void testGetElectronicsById_NotFound() {
        // Arrange
        String productId = "non-existent-id";
        when(electronicsRepository.findById(productId)).thenReturn(Optional.empty());

        // Act
        Optional<ElectronicsProduct> result = productService.getElectronicsById(productId);

        // Assert
        assertFalse(result.isPresent(), "Product should not be found");

        // Verify that the repository method was called exactly once
        verify(electronicsRepository, times(1)).findById(productId);
    }
}
