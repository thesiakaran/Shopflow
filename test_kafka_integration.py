import urllib.request
import json
import random
import time
import sys

gateway_url = "http://127.0.0.1:8080"

def test_flow():
    # 1. Generate random email to avoid duplicate key conflicts
    email = f"user_{random.randint(10000, 99999)}@example.com"
    print(f"Testing Kafka Integration with email: {email}")

    # 2. Register user
    reg_data = {
        "name": "Test User",
        "email": email,
        "password": "Password123",
        "phone": "9876543210"
    }
    
    req_reg = urllib.request.Request(
        f"{gateway_url}/api/auth/register",
        data=json.dumps(reg_data).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    
    try:
        with urllib.request.urlopen(req_reg) as resp:
            auth_res = json.loads(resp.read().decode("utf-8"))
            token = auth_res["token"]
            print("Successfully registered and obtained JWT Token.")
    except Exception as e:
        print("Registration failed:", e)
        sys.exit(1)

    # 3. Add item to cart
    cart_item = {
        "productId": "E001",
        "productName": "iPhone 15",
        "price": 79999.0,
        "quantity": 2,
        "category": "electronics"
    }
    
    req_cart = urllib.request.Request(
        f"{gateway_url}/api/cart/add",
        data=json.dumps(cart_item).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}"
        }
    )
    
    try:
        with urllib.request.urlopen(req_cart) as resp:
            cart_res = json.loads(resp.read().decode("utf-8"))
            print("Successfully added item to cart:", cart_res)
    except Exception as e:
        print("Adding to cart failed:", e)
        sys.exit(1)

    # 4. Place order
    order_req = {
        "paymentMethod": "COD",
        "shippingName": "Test Customer",
        "shippingPhone": "9876543210",
        "shippingAddress": "123 Main St",
        "shippingCity": "Delhi",
        "shippingState": "Delhi",
        "shippingPincode": "110001"
    }
    
    req_order = urllib.request.Request(
        f"{gateway_url}/api/orders/place",
        data=json.dumps(order_req).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}"
        }
    )
    
    try:
        with urllib.request.urlopen(req_order) as resp:
            order_res = json.loads(resp.read().decode("utf-8"))
            print(f"Successfully placed order. Order Number: {order_res.get('orderNumber')}")
    except Exception as e:
        print("Order placement failed:", e)
        sys.exit(1)

    print("Checkout flow request completed successfully. Waiting for Kafka messages to propagate...")
    time.sleep(3)
    print("Check background service logs for console prints!")

if __name__ == "__main__":
    test_flow()
