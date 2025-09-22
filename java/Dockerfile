# syntax=docker/dockerfile:1

#######################
# 1) Build stage
#######################
FROM maven:3.9.8-eclipse-temurin-17 AS build
WORKDIR /workspace

# Cache dependencies first for faster builds
COPY pom.xml .
RUN mvn -q -DskipTests dependency:go-offline

# Copy source and build the jar
COPY src ./src
RUN mvn -q -DskipTests package

#######################
# 2) Runtime stage
#######################
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy the built jar (use wildcard to ignore the exact file name)
COPY --from=build /workspace/target/*.jar /app/app.jar

# Run as non-root for security
RUN useradd -u 10001 spring && chown -R spring /app
USER spring

# Render provides PORT; your application.properties already supports ${PORT:8080}
EXPOSE 8080

# Optional JVM tuning
ENV JAVA_OPTS="-XX:MaxRAMPercentage=85"

# Start the app
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar /app/app.jar"]