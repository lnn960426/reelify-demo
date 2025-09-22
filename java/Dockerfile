# ---- Stage 1: build the jar ----
FROM eclipse-temurin:21-jdk AS build
WORKDIR /build

# Copy Maven wrapper & pom first for better layer caching
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw

# Copy sources
COPY src/ src/

# Skip compiling & running tests during Docker build
RUN ./mvnw -q -Dmaven.test.skip=true package

# ---- Stage 2: runtime image ----
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy the built jar (name-agnostic)
COPY --from=build /build/target/*.jar /app/app.jar

# Expose Spring Boot default port
EXPOSE 8080

# Some sensible JVM defaults in containers
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=75.0"

# Run the app
ENTRYPOINT ["java","-jar","/app/app.jar"]