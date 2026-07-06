@echo off
color 0B
title ShopFlow - Master Startup Script
echo ========================================================
echo          STARTING SHOPFLOW LOCAL ARCHITECTURE
echo ========================================================
echo.
echo WARNING: The Java Microservices will crash if you do not 
echo have PostgreSQL, MongoDB, Kafka, Redis, and Elasticsearch 
echo currently running on your computer!
echo.
echo Starting 6 Java Microservices and React Frontend...
echo.

echo Starting API Gateway (Port 8080)...
start "API Gateway" cmd /k "cd backend\api-gateway && ..\mvnw spring-boot:run"

echo Starting Auth Service (Port 8081)...
start "Auth Service" cmd /k "cd backend\auth-service && ..\mvnw spring-boot:run"

echo Starting Product Catalog (Port 8082)...
start "Product Catalog" cmd /k "cd backend\product-catalog-service && ..\mvnw spring-boot:run"

echo Starting Cart & Order (Port 8083)...
start "Cart & Order" cmd /k "cd backend\cart-order-service && ..\mvnw spring-boot:run"

echo Starting Inventory (Port 8084)...
start "Inventory" cmd /k "cd backend\inventory-service && ..\mvnw spring-boot:run"

echo Starting Notification (Port 8085)...
start "Notification" cmd /k "cd backend\notification-service && ..\mvnw spring-boot:run"

echo Starting React Frontend (Port 5173)...
start "React Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo All 7 windows have been launched!
pause
