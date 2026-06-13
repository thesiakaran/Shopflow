# Stage 1: Build the service
FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY backend/pom.xml ./backend/
COPY backend/product-catalog-service/pom.xml ./backend/product-catalog-service/
COPY backend/product-catalog-service/src ./backend/product-catalog-service/src
RUN mvn -f backend/product-catalog-service/pom.xml clean package -DskipTests

# Stage 2: Run the service
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/backend/product-catalog-service/target/*.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]
