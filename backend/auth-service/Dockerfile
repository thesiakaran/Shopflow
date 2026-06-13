# Stage 1: Build the service
FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY backend/pom.xml ./backend/
COPY backend/auth-service/pom.xml ./backend/auth-service/
COPY backend/auth-service/src ./backend/auth-service/src
RUN mvn -f backend/auth-service/pom.xml clean package -DskipTests

# Stage 2: Run the service
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/backend/auth-service/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
