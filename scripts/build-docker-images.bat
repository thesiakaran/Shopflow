@echo off
title ShopFlow Docker Build Orchestrator
echo =====================================================================
echo         Building Docker Images for ShopFlow Microservices
echo =====================================================================
echo.

echo [1/7] Building Auth Service...
docker build -t shopflow/auth-service:latest -f backend/auth-service/Dockerfile .
if errorlevel 1 goto error

echo.
echo [2/7] Building Product Catalog Service...
docker build -t shopflow/product-catalog-service:latest -f backend/product-catalog-service/Dockerfile .
if errorlevel 1 goto error

echo.
echo [3/7] Building Cart & Order Service...
docker build -t shopflow/cart-order-service:latest -f backend/cart-order-service/Dockerfile .
if errorlevel 1 goto error

echo.
echo [4/7] Building Inventory Service...
docker build -t shopflow/inventory-service:latest -f backend/inventory-service/Dockerfile .
if errorlevel 1 goto error

echo.
echo [5/7] Building Notification Service...
docker build -t shopflow/notification-service:latest -f backend/notification-service/Dockerfile .
if errorlevel 1 goto error

echo.
echo [6/7] Building API Gateway...
docker build -t shopflow/api-gateway:latest -f backend/api-gateway/Dockerfile .
if errorlevel 1 goto error

echo.
echo [7/7] Building Frontend...
docker build -t shopflow/frontend:latest -f Dockerfile.frontend .
if errorlevel 1 goto error

echo.
echo =====================================================================
echo            All Docker images built successfully!
echo =====================================================================
pause
exit /b 0

:error
echo.
echo =====================================================================
echo ERROR: Failed to build one or more Docker images. Please check the logs.
echo =====================================================================
pause
exit /b 1
