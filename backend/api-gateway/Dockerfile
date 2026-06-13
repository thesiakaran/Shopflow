# Stage 1: Build the service
FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY backend/pom.xml ./backend/
COPY backend/api-gateway/pom.xml ./backend/api-gateway/
COPY backend/api-gateway/src ./backend/api-gateway/src
RUN mvn -f backend/api-gateway/pom.xml clean package -DskipTests

# Stage 2: Run the service
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/backend/api-gateway/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
