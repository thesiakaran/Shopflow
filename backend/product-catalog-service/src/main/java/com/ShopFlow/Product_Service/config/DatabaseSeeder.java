package com.ShopFlow.Product_Service.config;

import com.ShopFlow.Product_Service.Repository.ElectronicsRepository;
import com.ShopFlow.Product_Service.Repository.FashionRepository;
import com.ShopFlow.Product_Service.Repository.ElasticElectronicsRepository;
import com.ShopFlow.Product_Service.Repository.ElasticFashionRepository;
import com.ShopFlow.Product_Service.entity.ElectronicsProduct;
import com.ShopFlow.Product_Service.entity.FashionProduct;
import com.ShopFlow.Product_Service.document.ElasticElectronicsProduct;
import com.ShopFlow.Product_Service.document.ElasticFashionProduct;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.stereotype.Component;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseSeeder implements CommandLineRunner {

    private final ElectronicsRepository electronicsRepository;
    private final FashionRepository fashionRepository;
    private final ElasticElectronicsRepository elasticElectronicsRepository;
    private final ElasticFashionRepository elasticFashionRepository;
    private final ObjectMapper objectMapper;
    private final ElasticsearchOperations elasticsearchOperations;

    @Override
    public void run(String... args) throws Exception {
        // 1. Check if we need to export from local database
        checkAndExportData();

        // 2. Seed PostgreSQL and MongoDB databases
        seedElectronics();
        seedFashion();
        cleanElectronicsCategories();

        // 3. Run Elasticsearch sync in a background thread so the service starts immediately
        Thread syncThread = new Thread(this::syncToElasticsearch, "elasticsearch-sync-thread");
        syncThread.setDaemon(true);
        syncThread.start();
        log.info("Elasticsearch sync started in background thread. Service is ready to serve from primary databases.");
    }

    private void checkAndExportData() {
        try {
            long elecCount = electronicsRepository.count();
            long fashionCount = fashionRepository.count();

            // If local databases are populated with large data (> 10 products), export them to JSON files
            if (elecCount > 10 || fashionCount > 10) {
                File dataDir = new File("src/main/resources/data");
                if (!dataDir.exists()) {
                    dataDir.mkdirs();
                }

                log.info("Local database contains significant data. Starting export to JSON files...");

                if (elecCount > 10) {
                    File elecFile = new File(dataDir, "electronics.json");
                    if (!elecFile.exists()) {
                        List<ElectronicsProduct> elecProducts = electronicsRepository.findAll();
                        objectMapper.writerWithDefaultPrettyPrinter().writeValue(elecFile, elecProducts);
                        log.info("Exported {} electronics products to {}", elecProducts.size(), elecFile.getAbsolutePath());
                    }
                }

                if (fashionCount > 10) {
                    File fashionFile = new File(dataDir, "fashion.json");
                    if (!fashionFile.exists()) {
                        List<FashionProduct> fashionProducts = fashionRepository.findAll();
                        objectMapper.writerWithDefaultPrettyPrinter().writeValue(fashionFile, fashionProducts);
                        log.info("Exported {} fashion products to {}", fashionProducts.size(), fashionFile.getAbsolutePath());
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Database export check skipped or failed (expected if running inside container): {}", e.getMessage());
        }
    }

    private void seedElectronics() {
        if (electronicsRepository.count() > 0) {
            log.info("Electronics database is already populated.");
            return;
        }

        // Try importing from JSON first
        try {
            Resource resource = new ClassPathResource("data/electronics.json");
            if (resource.exists()) {
                log.info("Loading electronics products from data/electronics.json classpath resource...");
                List<ElectronicsProduct> products = objectMapper.readValue(
                        resource.getInputStream(),
                        new TypeReference<List<ElectronicsProduct>>() {}
                );

                // Batch save to PostgreSQL
                int batchSize = 500;
                for (int i = 0; i < products.size(); i += batchSize) {
                    int end = Math.min(i + batchSize, products.size());
                    electronicsRepository.saveAll(products.subList(i, end));
                }
                log.info("Successfully imported {} electronics products from JSON file.", products.size());
                return;
            }
        } catch (Exception e) {
            log.error("Failed to load electronics from JSON file: {}. Falling back to default seeding.", e.getMessage());
        }

        log.info("Seeding electronics products into PostgreSQL database...");
        List<ElectronicsProduct> products = new ArrayList<>();

        products.add(createElec("elec_1", "iPhone 15 Pro Max (256GB)", "Apple", "Smartphones",
                "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=60",
                144900.00, "New", "true", "221g", "Apple Inc."));

        products.add(createElec("elec_2", "MacBook Pro 14 M3 (16GB/512GB)", "Apple", "Laptops",
                "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=60",
                169900.00, "New", "false", "1.55kg", "Apple Inc."));

        products.add(createElec("elec_3", "Sony WH-1000XM5 Wireless Headphones", "Sony", "Audio",
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60",
                29990.00, "New", "true", "250g", "Sony Corp."));

        products.add(createElec("elec_4", "Samsung Galaxy S24 Ultra", "Samsung", "Smartphones",
                "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=60",
                129999.00, "New", "false", "232g", "Samsung Electronics"));

        products.add(createElec("elec_5", "Dell XPS 13 Plus", "Dell", "Laptops",
                "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=60",
                119990.00, "New", "false", "1.2kg", "Dell Inc."));

        products.add(createElec("elec_6", "Apple Watch Series 9 GPS", "Apple", "Wearables",
                "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=60",
                41900.00, "New", "true", "39g", "Apple Inc."));

        products.add(createElec("elec_7", "iPad Pro 11-inch M2", "Apple", "Tablets",
                "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=60",
                81900.00, "New", "false", "466g", "Apple Inc."));

        products.add(createElec("elec_8", "Sony PlayStation 5 Slim Console", "Sony", "Gaming",
                "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=60",
                44990.00, "New", "true", "3.2kg", "Sony Interactive"));

        electronicsRepository.saveAll(products);
        log.info("Successfully seeded " + products.size() + " electronics products.");
    }

    private void seedFashion() {
        if (fashionRepository.count() > 0) {
            log.info("Fashion database is already populated.");
            return;
        }

        // Try importing from JSON first
        try {
            Resource resource = new ClassPathResource("data/fashion.json");
            if (resource.exists()) {
                log.info("Loading fashion products from data/fashion.json classpath resource...");
                List<FashionProduct> products = objectMapper.readValue(
                        resource.getInputStream(),
                        new TypeReference<List<FashionProduct>>() {}
                );

                // MongoDB can save large datasets efficiently
                fashionRepository.saveAll(products);
                log.info("Successfully imported {} fashion products from JSON file.", products.size());
                return;
            }
        } catch (Exception e) {
            log.error("Failed to load fashion from JSON file: {}. Falling back to default seeding.", e.getMessage());
        }

        log.info("Seeding fashion products into MongoDB database...");
        List<FashionProduct> products = new ArrayList<>();

        products.add(createFashion(10000, "Men", "Apparel", "Topwear", "Tshirts", "Navy Blue", "Summer", "2016", "Casual", "Men's Solid Round Neck Navy Blue T-Shirt", 499.00));
        products.add(createFashion(10001, "Women", "Apparel", "Topwear", "Tshirts", "Pink", "Summer", "2016", "Casual", "Women's Casual Pink Striped Top", 699.00));
        products.add(createFashion(10002, "Men", "Apparel", "Bottomwear", "Jeans", "Dark Blue", "All Season", "2017", "Casual", "Men's Slim Fit Dark Wash Blue Jeans", 1499.00));
        products.add(createFashion(10003, "Women", "Apparel", "Topwear", "Dresses", "Red", "Summer", "2018", "Formal", "Women's Classic Red A-Line Dress", 1999.00));
        products.add(createFashion(10004, "Men", "Footwear", "Shoes", "Sports Shoes", "Black", "All Season", "2019", "Sports", "Men's Performance Black Running Shoes", 2499.00));
        products.add(createFashion(10005, "Women", "Footwear", "Shoes", "Flats", "Beige", "Summer", "2019", "Casual", "Women's Comfort Beige Casual Flats", 899.00));
        products.add(createFashion(10006, "Men", "Apparel", "Topwear", "Shirts", "White", "Winter", "2020", "Formal", "Men's Premium White Formal Shirt", 1299.00));
        products.add(createFashion(10007, "Women", "Apparel", "Topwear", "Shirts", "Yellow", "Summer", "2020", "Casual", "Women's Floral Yellow Summer Shirt", 999.00));

        fashionRepository.saveAll(products);
        log.info("Successfully seeded " + products.size() + " fashion products.");
    }

    private ElectronicsProduct createElec(String id, String name, String brand, String subCat, String img, Double price, String cond, String sale, String weight, String manufacturer) {
        ElectronicsProduct p = new ElectronicsProduct();
        p.setId(id);
        p.setName(name);
        p.setBrand(brand);
        p.setCategory("electronics");
        p.setImageUrl(img);
        p.setPrice(price);
        p.setCondition(cond);
        p.setIsSale(sale);
        p.setWeight(weight);
        p.setManufacturer(manufacturer);
        return p;
    }

    private FashionProduct createFashion(Integer id, String gender, String masterCat, String subCat, String articleType, String colour, String season, String year, String usage, String displayName, Double price) {
        FashionProduct p = new FashionProduct();
        p.setId(id);
        p.setGender(gender);
        p.setMasterCategory(masterCat);
        p.setSubCategory(subCat);
        p.setArticleType(articleType);
        p.setBaseColour(colour);
        p.setSeason(season);
        p.setYear(year);
        p.setUsage(usage);
        p.setProductDisplayName(displayName);
        p.setPrice(price);
        p.setImageUrl("/images/" + id + ".jpg");
        return p;
    }

    private void cleanElectronicsCategories() {
        log.info("Cleaning up electronics categories in PostgreSQL...");
        List<ElectronicsProduct> products = electronicsRepository.findAll();
        boolean modified = false;
        for (ElectronicsProduct p : products) {
            String rawCat = p.getCategory();
            if (rawCat == null) continue;
            String lower = rawCat.toLowerCase();
            String cleanCat;
            if (lower.contains("smartphone") || lower.contains("phone") || lower.contains("iphone") || lower.contains("prepaid") || lower.contains("carrier cell")) {
                cleanCat = "Smartphones & Accessories";
            } else if (lower.contains("laptop") || lower.contains("computer") || lower.contains("notebook") || lower.contains("desktop") || lower.contains("monitor") || lower.contains("wacom") || lower.contains("keyboard") || lower.contains("mouse")) {
                cleanCat = "Computers & Laptops";
            } else if (lower.contains("tv") || lower.contains("television") || lower.contains("projector") || lower.contains("surge protector")) {
                cleanCat = "TVs & Home Theater";
            } else if (lower.contains("audio") || lower.contains("speaker") || lower.contains("headphone") || lower.contains("sound") || lower.contains("stereo") || lower.contains("receiver") || lower.contains("amplifier") || lower.contains("earbud") || lower.contains("turntable") || lower.contains("microphone")) {
                cleanCat = "Audio & Sound";
            } else if (lower.contains("camera") || lower.contains("photo") || lower.contains("lens") || lower.contains("camcorder") || lower.contains("tripod")) {
                cleanCat = "Cameras & Photo";
            } else if (lower.contains("game") || lower.contains("gaming") || lower.contains("playstation") || lower.contains("xbox") || lower.contains("nintendo") || lower.contains("console")) {
                cleanCat = "Gaming";
            } else if (lower.contains("watch") || lower.contains("wearable") || lower.contains("fitbit") || lower.contains("smartwatch")) {
                cleanCat = "Wearables";
            } else if (lower.contains("car ") || lower.contains("gps") || lower.contains("marine") || lower.contains("radar") || lower.contains("dashcam")) {
                cleanCat = "Car & GPS Electronics";
            } else {
                cleanCat = "Other Electronics";
            }
            if (!cleanCat.equals(rawCat)) {
                p.setCategory(cleanCat);
                modified = true;
            }
        }
        if (modified) {
            electronicsRepository.saveAll(products);
            log.info("Successfully cleaned and updated electronics categories in PostgreSQL.");
        } else {
            log.info("Electronics categories are already clean.");
        }
    }

    private void syncToElasticsearch() {
        try { Thread.sleep(5000); } catch (InterruptedException ignored) { return; }

        log.info("Starting memory-safe synchronization of databases with Elasticsearch...");
        try {
            // Programmatically check and create indexes and mappings if needed
            createIndexIfNeeded(ElasticElectronicsProduct.class);
            createIndexIfNeeded(ElasticFashionProduct.class);

            elasticElectronicsRepository.deleteAll();
            elasticFashionRepository.deleteAll();
            log.info("Cleared existing Elasticsearch indices.");

            syncElectronicsToEs();
            syncFashionToEs();

            log.info("Elasticsearch synchronization completed successfully.");
        } catch (Exception e) {
            log.error("Elasticsearch sync failed: {}", e.getMessage());
        }
    }

    private void createIndexIfNeeded(Class<?> clazz) {
        try {
            var indexOps = elasticsearchOperations.indexOps(clazz);
            if (!indexOps.exists()) {
                indexOps.create();
                indexOps.putMapping(indexOps.createMapping(clazz));
                log.info("Created Elasticsearch index and mapping dynamically for class: {}", clazz.getSimpleName());
            }
        } catch (Exception e) {
            log.warn("Could not check or create index for class {}: {}", clazz.getSimpleName(), e.getMessage());
        }
    }

    private void syncElectronicsToEs() {
        int batchSize = 50;
        int pageNum = 0;
        int totalSynced = 0;

        try {
            while (true) {
                Pageable pageable = PageRequest.of(pageNum, batchSize);
                Page<ElectronicsProduct> page = electronicsRepository.findAll(pageable);

                if (page.isEmpty()) break;

                List<ElasticElectronicsProduct> batch = page.getContent().stream().map(p -> {
                    ElasticElectronicsProduct ep = new ElasticElectronicsProduct();
                    ep.setId(p.getId());
                    ep.setName(p.getName());
                    ep.setBrand(p.getBrand());
                    ep.setCategory(p.getCategory());
                    ep.setImageUrl(p.getImageUrl());
                    ep.setPrice(p.getPrice());
                    ep.setCondition(p.getCondition());
                    ep.setIsSale(p.getIsSale());
                    ep.setWeight(p.getWeight());
                    ep.setManufacturer(p.getManufacturer());
                    return ep;
                }).toList();

                elasticElectronicsRepository.saveAll(batch);
                totalSynced += batch.size();

                if (!page.hasNext()) break;
                pageNum++;

                Thread.sleep(100);
            }
            log.info("Synced {} electronics products to Elasticsearch.", totalSynced);
        } catch (Exception e) {
            log.error("Electronics ES sync failed after {} items: {}", totalSynced, e.getMessage());
        }
    }

    private void syncFashionToEs() {
        int batchSize = 50;
        int pageNum = 0;
        int totalSynced = 0;

        try {
            while (true) {
                Pageable pageable = PageRequest.of(pageNum, batchSize);
                Page<FashionProduct> page = fashionRepository.findAll(pageable);

                if (page.isEmpty()) break;

                List<ElasticFashionProduct> batch = page.getContent().stream().map(p -> {
                    ElasticFashionProduct fp = new ElasticFashionProduct();
                    fp.setMongoID(p.getMongoID());
                    fp.setFashionId(p.getId());
                    fp.setGender(p.getGender());
                    fp.setMasterCategory(p.getMasterCategory());
                    fp.setSubCategory(p.getSubCategory());
                    fp.setArticleType(p.getArticleType());
                    fp.setBaseColour(p.getBaseColour());
                    fp.setSeason(p.getSeason());
                    fp.setYear(p.getYear());
                    fp.setUsage(p.getUsage());
                    fp.setProductDisplayName(p.getProductDisplayName());
                    fp.setPrice(p.getPrice());
                    fp.setImageUrl(p.getImageUrl());
                    return fp;
                }).toList();

                elasticFashionRepository.saveAll(batch);
                totalSynced += batch.size();

                if (totalSynced % 500 == 0) {
                    log.info("Fashion ES sync progress: {}/{} ...", totalSynced, page.getTotalElements());
                }

                if (!page.hasNext()) break;
                pageNum++;

                Thread.sleep(100);
            }
            log.info("Synced {} fashion products to Elasticsearch.", totalSynced);
        } catch (Exception e) {
            log.error("Fashion ES sync failed after {} items: {}", totalSynced, e.getMessage());
        }
    }
}
