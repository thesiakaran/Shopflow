# Stage 1: Build the service
FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY backend/pom.xml ./backend/
COPY backend/inventory-service/pom.xml ./backend/inventory-service/
COPY backend/inventory-service/src ./backend/inventory-service/src
RUN mvn -f backend/inventory-service/pom.xml clean package -DskipTests

# Stage 2: Run the service
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/backend/inventory-service/target/*.jar app.jar
EXPOSE 8084
ENTRYPOINT ["java", "-jar", "app.jar"]
