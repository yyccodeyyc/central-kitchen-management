#!/bin/bash

# 中央厨房管理系统启动脚本

echo "🚀 启动中央厨房管理系统..."

# 检查Java版本
java -version

# 设置JVM参数
export JAVA_OPTS="-Xms256m -Xmx512m -Djava.security.egd=file:/dev/./urandom"

# 如果有Maven，使用Maven启动
if command -v mvn &> /dev/null; then
    echo "📦 使用Maven启动..."
    mvn spring-boot:run
# 如果有Gradle，使用Gradle启动
elif command -v gradle &> /dev/null; then
    echo "📦 使用Gradle启动..."
    gradle bootRun
else
    echo "❌ 没有找到Maven或Gradle，请手动安装构建工具"
    echo "或者直接使用: java -jar target/central-kitchen-management-0.0.1-SNAPSHOT.jar"
    exit 1
fi
