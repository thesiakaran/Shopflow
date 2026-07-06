#!/bin/bash
set -e

echo "====================================================================="
echo "        Building Docker Images for ShopFlow Microservices (Linux)"
echo "====================================================================="
echo

echo "[1/7] Building Auth Service..."
docker build -t shopflow/auth-service:latest -f backend/auth-service/Dockerfile .
echo

echo "[2/7] Building Product Catalog Service..."
docker build -t shopflow/product-catalog-service:latest -f backend/product-catalog-service/Dockerfile .
echo

echo "[3/7] Building Cart & Order Service..."
docker build -t shopflow/cart-order-service:latest -f backend/cart-order-service/Dockerfile .
echo

echo "[4/7] Building Inventory Service..."
docker build -t shopflow/inventory-service:latest -f backend/inventory-service/Dockerfile .
echo

echo "[5/7] Building Notification Service..."
docker build -t shopflow/notification-service:latest -f backend/notification-service/Dockerfile .
echo

echo "[6/7] Building API Gateway..."
docker build -t shopflow/api-gateway:latest -f backend/api-gateway/Dockerfile .
echo

echo "[7/7] Building Frontend..."
docker build -t shopflow/frontend:latest -f Dockerfile.frontend .
echo

echo "====================================================================="
echo "           All Docker images built successfully!"
echo "====================================================================="
