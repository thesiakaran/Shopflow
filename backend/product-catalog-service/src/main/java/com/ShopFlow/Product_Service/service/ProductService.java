package com.ShopFlow.Product_Service.service;

import java.util.List;
import java.util.Optional;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.TextCriteria;
import org.springframework.stereotype.Service;

import com.ShopFlow.Product_Service.Repository.ElectronicsRepository;
import com.ShopFlow.Product_Service.Repository.FashionRepository;
import com.ShopFlow.Product_Service.Repository.ElasticElectronicsRepository;
import com.ShopFlow.Product_Service.Repository.ElasticFashionRepository;
import com.ShopFlow.Product_Service.entity.ElectronicsProduct;
import com.ShopFlow.Product_Service.entity.FashionProduct;
import com.ShopFlow.Product_Service.document.ElasticElectronicsProduct;
import com.ShopFlow.Product_Service.document.ElasticFashionProduct;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ElectronicsRepository electronicsRepository;
    private final FashionRepository fashionRepository;
    private final ElasticElectronicsRepository elasticElectronicsRepository;
    private final ElasticFashionRepository elasticFashionRepository;
    private final MongoTemplate mongoTemplate;


    // ——— Search and Paginate Electronics (PostgreSQL / Elasticsearch) ———
    public Page<ElectronicsProduct> searchElectronics(String category, String search, Pageable pageable) {
        // If a search query is present, try Elasticsearch first, then fall back to DB
        if (search != null && !search.trim().isEmpty()) {
            try {
                Page<ElasticElectronicsProduct> elasticResult;
                Pageable searchPageable = pageable;
                if (pageable.getSort().getOrderFor("id") != null) {
                    searchPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.unsorted());
                }
                if (category != null && !category.trim().isEmpty()) {
                    elasticResult = elasticElectronicsRepository.searchByCategory(category, search.trim(), searchPageable);
                } else {
                    elasticResult = elasticElectronicsRepository.searchAll(search.trim(), searchPageable);
                }
                
                // Map Elastic documents back to database entities for signature compatibility
                List<ElectronicsProduct> mappedList = elasticResult.getContent().stream().map(el -> {
                    ElectronicsProduct p = new ElectronicsProduct();
                    p.setId(el.getId());
                    p.setName(el.getName());
                    p.setBrand(el.getBrand());
                    p.setCategory(el.getCategory());
                    p.setImageUrl(el.getImageUrl());
                    p.setPrice(el.getPrice());
                    p.setCondition(el.getCondition());
                    p.setIsSale(el.getIsSale());
                    p.setWeight(el.getWeight());
                    p.setManufacturer(el.getManufacturer());
                    return p;
                }).toList();
                
                return new PageImpl<>(mappedList, pageable, elasticResult.getTotalElements());
            } catch (Exception e) {
                // Elasticsearch unavailable — fall back to database search
                log.warn("Elasticsearch unavailable for electronics search, falling back to DB: {}", e.getMessage());
                return electronicsRepository.searchProducts(category, search, pageable);
            }
        }

        // If no search query, fall back to standard database pagination
        if (category == null || category.trim().isEmpty()) {
            return electronicsRepository.findAll(pageable);
        }
        return electronicsRepository.searchProducts(category, search, pageable);
    }

    // ——— Search and Paginate Fashion (MongoDB / Elasticsearch) ———
    public Page<FashionProduct> searchFashion(String category, String search, Pageable pageable) {
        // If a search query is present, try Elasticsearch first, then fall back to DB
        if (search != null && !search.trim().isEmpty()) {
            try {
                Page<ElasticFashionProduct> elasticResult;
                Pageable searchPageable = pageable;
                if (pageable.getSort().getOrderFor("id") != null) {
                    searchPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.unsorted());
                }
                if (category != null && !category.trim().isEmpty()) {
                    elasticResult = elasticFashionRepository.searchByCategory(category, search.trim(), searchPageable);
                } else {
                    elasticResult = elasticFashionRepository.searchAll(search.trim(), searchPageable);
                }
                
                // Map Elastic documents back to database entities for signature compatibility
                List<FashionProduct> mappedList = elasticResult.getContent().stream().map(el -> {
                    FashionProduct p = new FashionProduct();
                    p.setMongoID(el.getMongoID());
                    p.setId(el.getFashionId());
                    p.setGender(el.getGender());
                    p.setMasterCategory(el.getMasterCategory());
                    p.setSubCategory(el.getSubCategory());
                    p.setArticleType(el.getArticleType());
                    p.setBaseColour(el.getBaseColour());
                    p.setSeason(el.getSeason());
                    p.setYear(el.getYear());
                    p.setUsage(el.getUsage());
                    p.setProductDisplayName(el.getProductDisplayName());
                    p.setPrice(el.getPrice());
                    p.setImageUrl(el.getImageUrl());
                    return p;
                }).toList();
                
                return new PageImpl<>(mappedList, pageable, elasticResult.getTotalElements());
            } catch (Exception e) {
                // Elasticsearch unavailable — fall back to MongoDB search
                log.warn("Elasticsearch unavailable for fashion search, falling back to DB: {}", e.getMessage());
            }
        }

        // Fall back to standard MongoDB pagination (also handles no-search case)
        if (category == null || category.trim().isEmpty()) {
            if (search != null && !search.trim().isEmpty()) {
                // Text search fallback using MongoDB regex on productDisplayName
                Query query = new Query();
                query.addCriteria(Criteria.where("productDisplayName").regex(search.trim(), "i"));
                long total = mongoTemplate.count(query, FashionProduct.class);
                query.with(pageable);
                List<FashionProduct> products = mongoTemplate.find(query, FashionProduct.class);
                return new PageImpl<>(products, pageable, total);
            }
            return fashionRepository.findAll(pageable);
        }
        Query query = new Query();
        query.addCriteria(Criteria.where("masterCategory").regex("^" + category.trim() + "$", "i"));
        if (search != null && !search.trim().isEmpty()) {
            query.addCriteria(Criteria.where("productDisplayName").regex(search.trim(), "i"));
        }
        long total = mongoTemplate.count(query, FashionProduct.class);
        query.with(pageable);
        List<FashionProduct> products = mongoTemplate.find(query, FashionProduct.class);
        return new PageImpl<>(products, pageable, total);
    }

    // ——— Fetch Distinct Electronics Categories ———
    @Cacheable(value = "electronics-categories")
    public List<String> getElectronicsCategories() {
        return electronicsRepository.findDistinctCategories();
    }

    // ——— Fetch Distinct Fashion Categories ———
    @Cacheable(value = "fashion-categories")
    public List<String> getFashionCategories() {
        return mongoTemplate.findDistinct(new Query(), "masterCategory", FashionProduct.class, String.class);
    }

    // ——— Get single electronics product by ID ———
    @Cacheable(value = "electronics-products", key = "#id", unless = "#result == null || #result.isEmpty()")
    public Optional<ElectronicsProduct> getElectronicsById(String id) {
        return electronicsRepository.findById(id);
    }

    // ——— Get single fashion product by ID ———
    @Cacheable(value = "fashion-products", key = "#id", unless = "#result == null || #result.isEmpty()")
    public Optional<FashionProduct> getFashionById(String id) {
        return fashionRepository.findById(id);
    }
}