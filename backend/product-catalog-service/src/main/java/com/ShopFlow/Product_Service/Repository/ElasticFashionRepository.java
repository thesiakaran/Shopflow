package com.ShopFlow.Product_Service.Repository;

import com.ShopFlow.Product_Service.document.ElasticFashionProduct;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface ElasticFashionRepository extends ElasticsearchRepository<ElasticFashionProduct, String> {

    @Query("{\"bool\": {\"must\": [{\"multi_match\": {\"query\": \"?0\", \"fields\": [\"productDisplayName^2\", \"baseColour\", \"articleType\", \"subCategory\", \"masterCategory\", \"gender\", \"usage\"], \"fuzziness\": \"AUTO\"}}]}}")
    Page<ElasticFashionProduct> searchAll(String search, Pageable pageable);

    @Query("{\"bool\": {\"must\": [{\"multi_match\": {\"query\": \"?1\", \"fields\": [\"productDisplayName^2\", \"baseColour\", \"articleType\", \"subCategory\", \"masterCategory\", \"gender\", \"usage\"], \"fuzziness\": \"AUTO\"}}], \"filter\": [{\"term\": {\"masterCategory\": \"?0\"}}]}}")
    Page<ElasticFashionProduct> searchByCategory(String category, String search, Pageable pageable);
    
    Page<ElasticFashionProduct> findByMasterCategory(String category, Pageable pageable);
}
