# ShopFlow: Architecture & File Analysis Report

## 1. Project Architecture & Design
ShopFlow is an enterprise-grade **Microservices E-Commerce Application**. 

### System Design
* **Frontend:** Built with **React.js** and **Vite**. It uses TailwindCSS/Vanilla CSS for styling and React Router for navigation. 
* **Backend:** A distributed **Spring Boot Microservices** architecture containing 6 distinct services.
* **Databases:** A polyglot persistence design:
  * **PostgreSQL:** Used for structured data (Users, Cart, Orders, Electronics).
  * **MongoDB:** Used for flexible, unstructured data (Fashion products with dynamic attributes).
  * **Elasticsearch:** Used for lightning-fast, fuzzy-text searching across products.
  * **Redis:** Used for caching frequently accessed data (like Category lists).
* **Message Broker:** **Apache Kafka** is used for asynchronous communication (e.g., when an Order is placed, a Kafka message triggers the Notification and Inventory services).

---

## 2. Detailed File & Folder Analysis

### Frontend (`/frontend`)
* **`package.json` / `vite.config.js`**: Configuration files for managing dependencies and the Vite build server.
* **`src/App.jsx`**: The main routing file (recently updated to use `React.lazy` for Code Splitting).
* **`src/pages/`**: Contains the UI views (`HomePage.jsx`, `ProductsPage.jsx`, `CartPage.jsx`, etc.).
* **`src/components/`**: Reusable UI widgets (`ProductCard.jsx`, `Navbar.jsx`).
* **`src/api/api.js`**: Axios interceptors that attach JWT tokens to API requests and route them to the backend API Gateway.

### Backend (`/backend`)
* **`api-gateway`**: Runs on port `8080`. Acts as the single entry point for the frontend. It routes `/api/auth` to the Auth Service and `/api/products` to the Product Catalog.
* **`auth-service`**: Handles user registration, login, and generates JWT (JSON Web Tokens). Uses PostgreSQL.
* **`product-catalog-service`**: The core catalog engine. Connects to Postgres (Electronics), Mongo (Fashion), and Elasticsearch (Search). 
* **`cart-order-service`**: Manages user carts and processes checkouts.
* **`inventory-service`**: Tracks stock levels and deducts stock when an order is placed.
* **`notification-service`**: Listens to Kafka topics and sends "Order Placed" emails/notifications.

---

## 3. Useless & "Dead" Files to Delete
During the deep scan of your project tree, several useless files, crash logs, and redundant scripts were found. You should safely delete these to clean up the repository:

### Safe to Delete (Scratch / Temp Files)
* 🗑️ `abba.txt`, `doc.txt`, `prmpt.txt`, `error.txt` - These are temporary text files created randomly during testing.
* 🗑️ `tree_structure.txt`, `clean_tree.txt`, `clean_tree_utf8.txt` - Temporary diagnostic files I just generated to scan your directory.

### Safe to Delete (Logs)
* 🗑️ `backend/product-catalog-service/hs_err_pid1984.log` - This is a Java fatal crash log from when your computer ran out of RAM previously. It is useless now.

### Redundant Scripts
* 🗑️ `start-backend-single.bat`, `start-backend.bat`, `start-frontend-dev.bat`, `start-frontend.bat`, `start-shareable-link.bat` - Since you are now using the optimized `run-shopflow-local.bat` to manage memory, these old scripts are obsolete and cluttering your root folder.

### Architectural Warning (The Image Bloat)
* ⚠️ **`frontend/dist/images/`** - There are **over 10,000 `.jpg` files** hardcoded into your frontend directory. This is extremely bad practice. Frontend repositories should never store thousands of product images, as it makes the Git repository massive and the build process slow. 
  * **Future Fix:** These images should be uploaded to a Cloud Storage bucket (like AWS S3 or Cloudinary) and the database should just store the URL links.
