package com.ShopFlow.Product_Service.Repository;

import com.ShopFlow.Product_Service.document.ElasticElectronicsProduct;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface ElasticElectronicsRepository extends ElasticsearchRepository<ElasticElectronicsProduct, String> {

    @Query("{\"bool\": {\"must\": [{\"multi_match\": {\"query\": \"?0\", \"fields\": [\"name^2\", \"brand\", \"category\", \"condition\", \"manufacturer\"], \"fuzziness\": \"AUTO\"}}]}}")
    Page<ElasticElectronicsProduct> searchAll(String search, Pageable pageable);

    @Query("{\"bool\": {\"must\": [{\"multi_match\": {\"query\": \"?1\", \"fields\": [\"name^2\", \"brand\", \"category\", \"condition\", \"manufacturer\"], \"fuzziness\": \"AUTO\"}}], \"filter\": [{\"term\": {\"category\": \"?0\"}}]}}")
    Page<ElasticElectronicsProduct> searchByCategory(String category, String search, Pageable pageable);
    
    Page<ElasticElectronicsProduct> findByCategory(String category, Pageable pageable);
}
