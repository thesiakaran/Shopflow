# ShopFlow 🛍️

**ShopFlow** is an enterprise-grade Microservices E-Commerce Application. 

🔗 **Live Demo (Mock Mode):** [https://shopflow-mauve.vercel.app/](https://shopflow-mauve.vercel.app/)

## Architecture Overview
* **Frontend:** Built with **React.js** and **Vite**. Features a fully functional mock-mode for serverless deployments.
* **Backend:** A distributed **Spring Boot Microservices** architecture containing 6 distinct services.
* **Databases:** PostgreSQL, MongoDB, Elasticsearch, Redis.
* **Message Broker:** Apache Kafka for asynchronous event-driven communication.

## Features
- ✅ Beautiful, modern UI with TailwindCSS
- ✅ Complete checkout flow
- ✅ Secure payment processing integrated via **Stripe**
- ✅ Responsive design for mobile and desktop

## Getting Started Locally
To run this project locally, you will need Java 17+, Node.js, Docker, and Maven installed.

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend Services
Run the docker-compose to bring up the databases, then start the individual microservices via Maven or your IDE.
