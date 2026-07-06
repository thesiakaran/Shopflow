@echo off
title ShopFlow Local Launcher
echo =====================================================================
echo                  Starting ShopFlow (Optimized Local Mode)
echo =====================================================================
echo.

:: 1. Map drive K: for Kafka path limits
echo [1/5] Mapping virtual drive K: for Kafka...
subst K: /d 2>nul
subst K: "%~dp0kafka"
if errorlevel 1 (
    echo INFO: Drive K: is already mapped or initialized.
)

:: 2. Start Infrastructure Services
echo [2/5] Starting Zookeeper, Kafka, and Elasticsearch...
start "ShopFlow - Zookeeper" cmd /c "K:\bin\windows\zookeeper-server-start.bat K:\config\zookeeper.properties"
ping 127.0.0.1 -n 6 >nul

start "ShopFlow - Kafka" cmd /c "K:\bin\windows\kafka-server-start.bat K:\config\server.properties"
ping 127.0.0.1 -n 4 >nul

start "ShopFlow - Elasticsearch" cmd /c "elasticsearch\elasticsearch-7.17.9\bin\elasticsearch.bat"
ping 127.0.0.1 -n 6 >nul

:: 3. Start Spring Boot Services (from compiled JARs with low RAM limits)
echo [3/5] Starting Microservices from built JARs (Low RAM heap: 128MB max)...

echo - Starting API Gateway (8080)...
start "ShopFlow - API Gateway (8080)" java -Xms64m -Xmx128m -jar backend\api-gateway\target\api-gateway-0.0.1-SNAPSHOT.jar
ping 127.0.0.1 -n 4 >nul

echo - Starting Auth Service (8081)...
start "ShopFlow - Auth Service (8081)" java -Xms64m -Xmx128m -jar backend\auth-service\target\auth-service-0.0.1-SNAPSHOT.jar
ping 127.0.0.1 -n 4 >nul

echo - Starting Product Catalog (8082)...
start "ShopFlow - Product Catalog (8082)" java -Xms64m -Xmx128m -jar backend\product-catalog-service\target\product-catalog-service-0.0.1-SNAPSHOT.jar
ping 127.0.0.1 -n 4 >nul

echo - Starting Cart & Order Service (8083)...
start "ShopFlow - Cart & Order (8083)" java -Xms64m -Xmx128m -jar backend\cart-order-service\target\cart-order-service-0.0.1-SNAPSHOT.jar
ping 127.0.0.1 -n 4 >nul

echo - Starting Inventory Service (8084)...
start "ShopFlow - Inventory Service (8084)" java -Xms64m -Xmx128m -jar backend\inventory-service\target\inventory-service-0.0.1-SNAPSHOT.jar
ping 127.0.0.1 -n 4 >nul

echo - Starting Notification Service (8085)...
start "ShopFlow - Notification Service (8085)" java -Xms64m -Xmx128m -jar backend\notification-service\target\notification-service-0.0.1-SNAPSHOT.jar
ping 127.0.0.1 -n 4 >nul

:: 4. Start Frontend
echo [4/5] Starting Frontend dev server...
start "ShopFlow - Frontend (5173)" cmd /c "cd frontend && npm.cmd run dev"

:: 5. Done
echo.
echo =====================================================================
echo ShopFlow is starting!
echo - Gateway:    http://localhost:8080
echo - Frontend:   http://localhost:5173
echo.
echo Please allow 15-20 seconds for Spring Boot services to bind to their ports.
echo =====================================================================
pause
