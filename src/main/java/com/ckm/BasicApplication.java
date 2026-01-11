package com.ckm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class BasicApplication {

    public static void main(String[] args) {
        SpringApplication.run(BasicApplication.class, args);
        System.out.println("==========================================");
        System.out.println("🏭 中央厨房管理系统启动成功！");
        System.out.println("==========================================");
        System.out.println("访问地址: http://localhost:8080");
        System.out.println("H2控制台: http://localhost:8080/h2-console");
        System.out.println("==========================================");
    }

    @GetMapping("/")
    public String home() {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <title>中央厨房管理系统</title>
                <meta charset="UTF-8">
                <style>
                    body { font-family: 'Microsoft YaHei', Arial, sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
                    .container { max-width: 900px; margin: 0 auto; background: white; border-radius: 15px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden; }
                    .header { background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%); color: white; padding: 30px; text-align: center; }
                    .header h1 { margin: 0; font-size: 2.5em; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
                    .status { background: #27ae60; color: white; padding: 10px; text-align: center; font-weight: bold; font-size: 1.2em; }
                    .content { padding: 30px; }
                    .feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 30px 0; }
                    .feature-card { background: #f8f9fa; border-radius: 10px; padding: 20px; border-left: 5px solid #3498db; transition: transform 0.3s; }
                    .feature-card:hover { transform: translateY(-5px); }
                    .feature-card h3 { margin-top: 0; color: #2c3e50; }
                    .tech-stack { background: #ecf0f1; padding: 20px; border-radius: 10px; margin: 20px 0; }
                    .tech-stack ul { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; padding: 0; list-style: none; }
                    .tech-stack li { padding: 8px 0; position: relative; padding-left: 20px; }
                    .tech-stack li:before { content: "✓"; color: #27ae60; font-weight: bold; position: absolute; left: 0; }
                    .api-info { background: #34495e; color: white; padding: 20px; border-radius: 10px; margin: 20px 0; }
                    .api-info a { color: #3498db; text-decoration: none; }
                    .api-info a:hover { text-decoration: underline; }
                    .footer { background: #2c3e50; color: white; text-align: center; padding: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🏭 中央厨房管理系统</h1>
                        <p>专业餐饮加盟管理解决方案</p>
                    </div>

                    <div class="status">
                        ✅ 系统运行正常 - 完全可用！
                    </div>

                    <div class="content">
                        <div class="feature-grid">
                            <div class="feature-card">
                                <h3>👥 用户管理</h3>
                                <p>多角色权限管理系统，支持管理员、加盟商、店长、厨房管理员等角色。</p>
                            </div>
                            <div class="feature-card">
                                <h3>🏭 中央厨房</h3>
                                <p>库存管理、生产计划、质量控制，实现标准化集中化生产。</p>
                            </div>
                            <div class="feature-card">
                                <h3>🏪 门店管理</h3>
                                <p>加盟门店信息管理、运营监控、绩效评估系统。</p>
                            </div>
                            <div class="feature-card">
                                <h3>📦 订单配送</h3>
                                <p>智能订单处理、配送跟踪、客户服务一体化。</p>
                            </div>
                            <div class="feature-card">
                                <h3>💰 财务分析</h3>
                                <p>成本核算、利润分析、财务报表自动生成。</p>
                            </div>
                            <div class="feature-card">
                                <h3>📊 数据报表</h3>
                                <p>销售统计、运营分析、可视化数据看板。</p>
                            </div>
                        </div>

                        <div class="tech-stack">
                            <h3>🔧 技术架构</h3>
                            <ul>
                                <li>Spring Boot 3.2.0</li>
                                <li>Java 17</li>
                                <li>H2 内存数据库</li>
                                <li>JPA/Hibernate ORM</li>
                                <li>RESTful API</li>
                                <li>Thymeleaf 模板引擎</li>
                            </ul>
                        </div>

                        <div class="api-info">
                            <h3>🚀 系统信息</h3>
                            <p><strong>访问地址：</strong> http://localhost:8080</p>
                            <p><strong>H2数据库控制台：</strong> <a href="/h2-console" target="_blank">http://localhost:8080/h2-console</a></p>
                            <p><strong>数据库连接：</strong> jdbc:h2:mem:testdb (用户名: sa, 密码: 空)</p>
                            <p><strong>健康检查：</strong> <a href="/api/health">/api/health</a></p>
                            <p><strong>默认账户：</strong> admin / admin123</p>
                        </div>
                    </div>

                    <div class="footer">
                        <p>中央厨房管理系统 © 2024 - 专业的餐饮加盟数字化解决方案</p>
                    </div>
                </div>
            </body>
            </html>
            """;
    }

    @GetMapping("/api/health")
    public String health() {
        return "{\"status\":\"UP\",\"timestamp\":\"" + java.time.LocalDateTime.now() + "\",\"service\":\"中央厨房管理系统\",\"version\":\"1.0.0\"}";
    }

    @GetMapping("/api/info")
    public String info() {
        return """
            {
                "service": "中央厨房管理系统",
                "version": "1.0.0",
                "description": "专业的餐饮加盟管理解决方案",
                "features": [
                    "用户权限管理",
                    "中央厨房运营",
                    "门店加盟管理",
                    "订单配送系统",
                    "财务分析报表",
                    "数据统计分析"
                ],
                "techStack": {
                    "backend": "Spring Boot 3.2.0",
                    "database": "H2 (内存数据库)",
                    "frontend": "Thymeleaf + Bootstrap",
                    "language": "Java 17"
                },
                "status": "运行正常"
            }
            """;
    }
}
