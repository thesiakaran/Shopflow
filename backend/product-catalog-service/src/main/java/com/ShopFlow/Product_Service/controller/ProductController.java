package com.ShopFlow.Product_Service.controller;

import com.ShopFlow.Product_Service.entity.ElectronicsProduct;
import com.ShopFlow.Product_Service.entity.FashionProduct;
import com.ShopFlow.Product_Service.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // Helper to create pageable with sorting
    private Pageable createPageable(int page, int size, String sortBy, String defaultSortField) {
        if ("price-low".equalsIgnoreCase(sortBy)) {
            return PageRequest.of(page, size, Sort.by("price").ascending());
        } else if ("price-high".equalsIgnoreCase(sortBy)) {
            return PageRequest.of(page, size, Sort.by("price").descending());
        } else {
            return PageRequest.of(page, size, Sort.by(defaultSortField).ascending());
        }
    }

    // ─── GET ALL ELECTRONICS (PAGINATED + SEARCH + FILTER) ─────────
    // GET http://localhost:8080/api/products/electronics?page=0&size=20&search=&category=&sortBy=default
    @GetMapping("/electronics")
    public ResponseEntity<Page<ElectronicsProduct>> getElectronics(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "default") String sortBy
    ) {
        Pageable pageable = createPageable(page, size, sortBy, "id");
        Page<ElectronicsProduct> result = productService.searchElectronics(category, search, pageable);
        return ResponseEntity.ok(result);
    }

    // ─── GET ALL FASHION (PAGINATED + SEARCH + FILTER) ─────────────
    // GET http://localhost:8080/api/products/fashion?page=0&size=20&search=&category=&sortBy=default
    @GetMapping("/fashion")
    public ResponseEntity<Page<FashionProduct>> getFashion(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "default") String sortBy
    ) {
        Pageable pageable = createPageable(page, size, sortBy, "id");
        Page<FashionProduct> result = productService.searchFashion(category, search, pageable);
        return ResponseEntity.ok(result);
    }

    // ─── GET DISTINCT ELECTRONICS CATEGORIES ───────────────────────
    // GET http://localhost:8080/api/products/electronics/categories
    @GetMapping("/electronics/categories")
    public ResponseEntity<List<String>> getElectronicsCategories() {
        return ResponseEntity.ok(productService.getElectronicsCategories());
    }

    // ─── GET DISTINCT FASHION CATEGORIES ───────────────────────────
    // GET http://localhost:8080/api/products/fashion/categories
    @GetMapping("/fashion/categories")
    public ResponseEntity<List<String>> getFashionCategories() {
        return ResponseEntity.ok(productService.getFashionCategories());
    }

    // ─── GET SINGLE ELECTRONICS PRODUCT ──────────────────────────
    // GET http://localhost:8080/api/products/electronics/{id}
    @GetMapping("/electronics/{id}")
    public ResponseEntity<?> getElectronicsById(@PathVariable String id) {
        return productService.getElectronicsById(id)
                .map(product -> ResponseEntity.ok((Object) product))
                .orElse(ResponseEntity.status(404)
                        .body(Map.of("error", "Electronics product not found")));
    }

    // ─── GET SINGLE FASHION PRODUCT ──────────────────────────────
    // GET http://localhost:8080/api/products/fashion/{id}
    @GetMapping("/fashion/{id}")
    public ResponseEntity<?> getFashionById(@PathVariable String id) {
        return productService.getFashionById(id)
                .map(product -> ResponseEntity.ok((Object) product))
                .orElse(ResponseEntity.status(404)
                        .body(Map.of("error", "Fashion product not found")));
    }
}