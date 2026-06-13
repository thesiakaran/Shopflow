package com.ShopFlow.Product_Service.Repository;



import com.ShopFlow.Product_Service.entity.FashionProduct;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FashionRepository extends MongoRepository<FashionProduct, String> {
    // By extending MongoRepository, Spring automatically gives you
    // the methods to read and write to your MongoDB database!
}