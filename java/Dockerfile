# ---------- Build stage ----------
FROM eclipse-temurin:21-jdk AS build

# Work inside a clean build directory
WORKDIR /build

# Copy Maven Wrapper + pom first to leverage Docker layer cache
COPY java/mvnw java/pom.xml java/.mvn/ ./
RUN chmod +x mvnw

# Copy the module source (your project lives under repo/java)
COPY java/ ./

# Build the fat jar (skip tests for faster CI)
RUN ./mvnw -DskipTests package

# ---------- Runtime stage ----------
FROM eclipse-temurin:21-jre

# App directory inside the runtime image
WORKDIR /app

# Copy the built jar from the build stage
COPY --from=build /build/target/*.jar /app/app.jar

# Render provides PORT env var; Spring Boot will bind to 8080 by default
ENV PORT=8080
EXPOSE 8080

# Start the application
ENTRYPOINT ["java","-jar","/app/app.jar"]