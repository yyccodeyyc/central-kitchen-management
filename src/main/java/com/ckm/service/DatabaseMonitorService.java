package com.ckm.service;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

/**
 * 数据库监控服务
 * 提供数据库连接池监控和健康检查功能
 */
@Service
public class DatabaseMonitorService implements HealthIndicator {

    private final DataSource dataSource;

    @Autowired
    public DatabaseMonitorService(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    /**
     * Actuator健康检查
     */
    @Override
    public Health health() {
        Map<String, Object> details = new HashMap<>();

        try {
            // 基本连接测试
            try (Connection connection = dataSource.getConnection()) {
                details.put("database", "UP");
                details.put("connection", "SUCCESS");
            }

            // 如果是HikariCP，获取连接池信息
            if (dataSource instanceof HikariDataSource) {
                HikariDataSource hikariDataSource = (HikariDataSource) dataSource;

                details.put("poolName", hikariDataSource.getPoolName());
                details.put("activeConnections", hikariDataSource.getHikariPoolMXBean().getActiveConnections());
                details.put("idleConnections", hikariDataSource.getHikariPoolMXBean().getIdleConnections());
                details.put("totalConnections", hikariDataSource.getHikariPoolMXBean().getTotalConnections());
                details.put("threadsAwaitingConnection", hikariDataSource.getHikariPoolMXBean().getThreadsAwaitingConnection());

                // 检查连接池状态
                int activeConnections = hikariDataSource.getHikariPoolMXBean().getActiveConnections();
                int totalConnections = hikariDataSource.getHikariPoolMXBean().getTotalConnections();
                int maxPoolSize = hikariDataSource.getMaximumPoolSize();

                // 如果活跃连接数接近最大连接数，标记为警告状态
                if (activeConnections >= maxPoolSize * 0.8) {
                    return Health.warning()
                            .withDetails(details)
                            .withDetail("message", "Connection pool usage is high")
                            .build();
                }

                // 如果有线程等待连接，标记为警告状态
                if (hikariDataSource.getHikariPoolMXBean().getThreadsAwaitingConnection() > 0) {
                    return Health.warning()
                            .withDetails(details)
                            .withDetail("message", "Threads are waiting for database connections")
                            .build();
                }
            }

            return Health.up().withDetails(details).build();

        } catch (SQLException e) {
            details.put("database", "DOWN");
            details.put("error", e.getMessage());
            return Health.down(e).withDetails(details).build();
        }
    }

    /**
     * 获取数据库连接池状态信息
     */
    public Map<String, Object> getConnectionPoolStatus() {
        Map<String, Object> status = new HashMap<>();

        if (dataSource instanceof HikariDataSource) {
            HikariDataSource hikariDataSource = (HikariDataSource) dataSource;

            status.put("poolName", hikariDataSource.getPoolName());
            status.put("jdbcUrl", hikariDataSource.getJdbcUrl());
            status.put("username", hikariDataSource.getUsername());
            status.put("driverClassName", hikariDataSource.getDriverClassName());

            // 连接池配置
            status.put("maximumPoolSize", hikariDataSource.getMaximumPoolSize());
            status.put("minimumIdle", hikariDataSource.getMinimumIdle());
            status.put("idleTimeout", hikariDataSource.getIdleTimeout());
            status.put("maxLifetime", hikariDataSource.getMaxLifetime());
            status.put("connectionTimeout", hikariDataSource.getConnectionTimeout());
            status.put("validationTimeout", hikariDataSource.getValidationTimeout());
            status.put("leakDetectionThreshold", hikariDataSource.getLeakDetectionThreshold());

            // 运行时状态
            var poolMXBean = hikariDataSource.getHikariPoolMXBean();
            status.put("activeConnections", poolMXBean.getActiveConnections());
            status.put("idleConnections", poolMXBean.getIdleConnections());
            status.put("totalConnections", poolMXBean.getTotalConnections());
            status.put("threadsAwaitingConnection", poolMXBean.getThreadsAwaitingConnection());

            // 性能指标
            var configMXBean = hikariDataSource.getHikariConfigMXBean();
            status.put("connectionCreationTimeMean", configMXBean.getConnectionCreationTimeMean());
            status.put("connectionCreationTimeMax", configMXBean.getConnectionCreationTimeMax());
            status.put("usageTimeMean", configMXBean.getUsageTimeMean());
            status.put("usageTimeMax", configMXBean.getUsageTimeMax());
        }

        return status;
    }

    /**
     * 测试数据库连接
     */
    public boolean testConnection() {
        try (Connection connection = dataSource.getConnection()) {
            return connection.isValid(5); // 5秒超时
        } catch (SQLException e) {
            return false;
        }
    }

    /**
     * 获取数据库基本信息
     */
    public Map<String, Object> getDatabaseInfo() {
        Map<String, Object> info = new HashMap<>();

        try (Connection connection = dataSource.getConnection()) {
            var metaData = connection.getMetaData();

            info.put("databaseProductName", metaData.getDatabaseProductName());
            info.put("databaseProductVersion", metaData.getDatabaseProductVersion());
            info.put("driverName", metaData.getDriverName());
            info.put("driverVersion", metaData.getDriverVersion());
            info.put("url", metaData.getURL());
            info.put("username", metaData.getUserName());

            // 测试查询
            try (var statement = connection.createStatement();
                 var resultSet = statement.executeQuery("SELECT 1")) {
                if (resultSet.next()) {
                    info.put("testQuery", "SUCCESS");
                }
            }

        } catch (SQLException e) {
            info.put("error", e.getMessage());
        }

        return info;
    }

    /**
     * 获取数据库性能指标
     */
    public Map<String, Object> getPerformanceMetrics() {
        Map<String, Object> metrics = new HashMap<>();

        if (dataSource instanceof HikariDataSource) {
            HikariDataSource hikariDataSource = (HikariDataSource) dataSource;
            var configMXBean = hikariDataSource.getHikariConfigMXBean();

            metrics.put("connectionCreationTimeMean", configMXBean.getConnectionCreationTimeMean() + "ms");
            metrics.put("connectionCreationTimeMax", configMXBean.getConnectionCreationTimeMax() + "ms");
            metrics.put("usageTimeMean", configMXBean.getUsageTimeMean() + "ms");
            metrics.put("usageTimeMax", configMXBean.getUsageTimeMax() + "ms");

            // 计算连接池利用率
            var poolMXBean = hikariDataSource.getHikariPoolMXBean();
            int active = poolMXBean.getActiveConnections();
            int total = poolMXBean.getTotalConnections();
            double utilizationRate = total > 0 ? (double) active / total * 100 : 0;

            metrics.put("poolUtilizationRate", String.format("%.2f%%", utilizationRate));
            metrics.put("activeConnections", active);
            metrics.put("totalConnections", total);
            metrics.put("idleConnections", poolMXBean.getIdleConnections());
        }

        return metrics;
    }
}
