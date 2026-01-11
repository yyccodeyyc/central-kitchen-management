# 中央厨房餐饮加盟管理系统

## 项目简介

这是一个基于Spring Boot的中央厨房餐饮加盟管理系统，实现中央厨房模式的核心业务流程，包括库存管理、生产计划、门店运营、订单处理等功能。

## 核心特色

### 🏭 现代化中央厨房管理
- **生产标准化管理**: 标准化配方、烹饪标准、质量控制
- **质量追溯系统**: 食材批次追溯、保质期管理、质量检测
- **供应商管理系统**: 供应商评级、合同管理、配送监控
- **智能分析与预警**: 运营仪表板、生产效率分析、成本预测、库存预警

### 🎨 企业级前端界面
- **现代化仪表板**: 基于React + Material-UI的企业级界面
- **实时数据可视化**: ECharts图表库支持的数据分析展示
- **响应式设计**: 支持桌面和移动设备访问
- **现代化UI设计**: 渐变背景、卡片布局、动画效果

## 技术栈

- **后端**: Spring Boot 3.2.0 + Java 17
- **数据库**: MySQL 8.0 / H2 (开发)
- **安全**: Spring Security + JWT
- **前端**: React 18 + TypeScript + Material-UI + ECharts
- **构建**: Maven + npm

## 功能模块

### ✅ 已实现功能

#### 1. 用户管理系统
- 用户注册登录
- 角色权限管理 (管理员、加盟商、店长、厨房管理员)
- JWT身份认证

#### 2. 中央厨房管理
- 📦 库存管理 (入库、出库、库存预警)
- 🏭 生产计划管理 (计划制定、生产跟踪、效率分析)
- 📊 统计报表 (库存价值、生产效率)

#### 3. 加盟门店管理
- 门店信息管理
- 运营状态监控
- 加盟商管理

#### 4. 订单管理系统
- 订单创建与跟踪
- 配送管理
- 客户服务

#### 5. 产品管理
- 产品信息维护
- 价格管理
- 分类管理

#### 6. 生产标准化管理 ⭐ **新增**
- 标准化配方管理
- 烹饪时间和重量标准
- 质量标准制定
- 设备需求配置
- 配方状态管理

#### 7. 质量追溯系统 ⭐ **新增**
- 食材批次追溯
- 生产日期和保质期管理
- 供应商信息记录
- 质量检测结果追踪
- 到期预警机制

#### 8. 供应商管理系统 ⭐ **新增**
- 供应商信息管理
- 质量等级评定
- 合同价格管理
- 配送周期监控
- 供应商绩效评估

#### 9. 智能分析与预警 ⭐ **新增**
- 运营数据仪表板
- 生产效率分析
- 成本分析与预测
- 质量指标监控
- 库存智能预警
- 需求预测分析

## 🚀 快速开始

### 后端环境要求
- JDK 17+
- MySQL 8.0+
- Maven 3.6+

### 前端环境要求
- Node.js 16+
- npm 或 yarn

### 1. 数据库配置
```sql
CREATE DATABASE ckm_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. 后端配置
修改 `src/main/resources/application.yml` 中的数据库连接信息：
```yaml
spring:
  datasource:
    username: your_username
    password: your_password
```

### 3. 启动后端服务
```bash
# 后端启动
mvn spring-boot:run
```

### 4. 启动前端服务
```bash
# 前端启动
cd frontend
npm install
npm start
```

### 5. 访问应用
- 后端API: http://localhost:8080
- 前端仪表板: http://localhost:3000
- 默认管理员账户: `admin` / `admin123`

## API文档

### 认证接口
```
POST /api/auth/login    # 用户登录
POST /api/auth/register # 用户注册
```

### 厨房管理接口
```
GET  /api/kitchen/inventory              # 获取库存列表
GET  /api/kitchen/production-plans       # 获取生产计划
POST /api/kitchen/production-plans       # 创建生产计划
```

### 门店管理接口
```
GET  /api/store                         # 获取门店列表
POST /api/store                         # 创建门店
```

## 项目结构

```
central-kitchen-management/
├── src/main/java/com/ckm/
│   ├── CentralKitchenManagementApplication.java
│   ├── config/                          # 配置类
│   ├── controller/                      # 控制器层
│   ├── entity/                          # 实体类
│   ├── repository/                      # 数据访问层
│   ├── service/                         # 业务逻辑层
│   └── security/                        # 安全相关
├── src/main/resources/
│   ├── application.yml                  # 应用配置
│   └── templates/                       # Thymeleaf模板
└── pom.xml                             # Maven配置
```

## 核心业务流程

### 中央厨房运营流程
1. **产品管理**: 定义菜品信息、价格、制作标准
2. **库存管理**: 监控原材料库存，及时补货
3. **生产计划**: 根据订单需求制定生产计划
4. **质量控制**: 生产过程质量检查
5. **配送管理**: 成品配送到各加盟门店

### 加盟门店运营流程
1. **订单接收**: 接收客户订单
2. **厨房备货**: 从中央厨房获取成品
3. **门店销售**: 向客户提供服务
4. **数据上报**: 上报销售数据和运营情况

## 部署说明

### 开发环境
```bash
mvn clean compile
mvn spring-boot:run
```

### 生产环境
```bash
mvn clean package -DskipTests
java -jar target/central-kitchen-management-0.0.1-SNAPSHOT.jar
```

## 联系方式

如有问题或建议，请联系开发团队。

---

**注意**: 这是一个演示版本，实际部署时请根据生产环境要求进行安全配置和性能优化。
