# Stage 1: Build the service
FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY backend/pom.xml ./backend/
COPY backend/notification-service/pom.xml ./backend/notification-service/
COPY backend/notification-service/src ./backend/notification-service/src
RUN mvn -f backend/notification-service/pom.xml clean package -DskipTests

# Stage 2: Run the service
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/backend/notification-service/target/*.jar app.jar
EXPOSE 8085
ENTRYPOINT ["java", "-jar", "app.jar"]
