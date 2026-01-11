# 多阶段构建 - 后端
FROM maven:3.9.4-openjdk-17-slim AS backend-builder

WORKDIR /app
COPY pom.xml .
COPY src ./src

# 构建应用
RUN mvn clean package -DskipTests

# 运行阶段
FROM openjdk:17-jre-slim

WORKDIR /app
COPY --from=backend-builder /app/target/*.jar app.jar

# 创建非root用户
RUN groupadd -r ckm && useradd -r -g ckm ckm
RUN chown -R ckm:ckm /app
USER ckm

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
