@echo off
title ShopFlow Backend (Single Window)
set JAVA_TOOL_OPTIONS=-Xms128m -Xmx256m -Dstdout.encoding=UTF-8 -Dstderr.encoding=UTF-8
echo =====================================================================
echo           Starting ShopFlow Backend Services in Single Window
echo =====================================================================

:: Map K: drive to bypass Windows path limit bug in Kafka
echo [0/2] Mapping virtual drive K: for Kafka path...
subst K: /d 2>nul
subst K: "C:\Users\admin\Desktop\shopflow\kafka"
if errorlevel 1 (
    echo WARNING: Could not map drive K:. If it is already mapped, we will proceed.
)

echo.
echo [1/2] Starting Infrastructure (Zookeeper, Kafka, Elasticsearch)...
echo.

:: Start Zookeeper
start /b "ShopFlow - Zookeeper" cmd /c "K:\bin\windows\zookeeper-server-start.bat K:\config\zookeeper.properties"
timeout /t 5 >nul

:: Start Kafka
start /b "ShopFlow - Kafka" cmd /c "K:\bin\windows\kafka-server-start.bat K:\config\server.properties"

:: Start Elasticsearch
start /b "ShopFlow - Elasticsearch" cmd /c "elasticsearch\elasticsearch-7.17.9\bin\elasticsearch.bat"
timeout /t 10 >nul

echo.
echo [2/2] Starting Spring Boot Microservices...
echo.

:: Start Spring Boot Services
start /b "ShopFlow - API Gateway (8080)" cmd /c "cd backend\api-gateway && ..\mvnw.cmd spring-boot:run"
start /b "ShopFlow - Auth Service (8081)" cmd /c "cd backend\auth-service && ..\mvnw.cmd spring-boot:run"
start /b "ShopFlow - Product Catalog (8082)" cmd /c "cd backend\product-catalog-service && ..\mvnw.cmd spring-boot:run"
start /b "ShopFlow - Cart & Order (8083)" cmd /c "cd backend\cart-order-service && ..\mvnw.cmd spring-boot:run"
start /b "ShopFlow - Inventory Service (8084)" cmd /c "cd backend\inventory-service && ..\mvnw.cmd spring-boot:run"
start /b "ShopFlow - Notification Service (8085)" cmd /c "cd backend\notification-service && ..\mvnw.cmd spring-boot:run"

echo =====================================================================
echo All backend services running in the background of this window!
echo Close this window to stop all services.
echo =====================================================================
pause
