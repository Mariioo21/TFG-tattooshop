# ====== build ======
FROM maven:3.9.9-eclipse-temurin-21 AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn -B -q -DskipTests dependency:go-offline
COPY src ./src
RUN mvn -B -DskipTests package

# ====== runtime ======
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
# copia el jar generado (coge el único .jar del target)
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
# puedes pasar JAVA_OPTS desde el compose si quieres
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar app.jar"]
