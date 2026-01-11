package com.ckm.controller;

import com.ckm.service.DatabaseMonitorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * 数据库监控控制器
 * 提供数据库状态监控和诊断API
 */
@RestController
@RequestMapping("/api/monitor/database")
@Tag(name = "Database Monitor", description = "数据库监控和管理API")
@PreAuthorize("hasRole('ADMIN')")
public class DatabaseMonitorController {

    private final DatabaseMonitorService databaseMonitorService;

    @Autowired
    public DatabaseMonitorController(DatabaseMonitorService databaseMonitorService) {
        this.databaseMonitorService = databaseMonitorService;
    }

    /**
     * 获取数据库连接池状态
     */
    @GetMapping("/pool/status")
    @Operation(summary = "获取连接池状态", description = "获取数据库连接池的详细状态信息")
    public ResponseEntity<Map<String, Object>> getConnectionPoolStatus() {
        Map<String, Object> status = databaseMonitorService.getConnectionPoolStatus();
        return ResponseEntity.ok(status);
    }

    /**
     * 获取数据库基本信息
     */
    @GetMapping("/info")
    @Operation(summary = "获取数据库信息", description = "获取数据库的基本信息和连接状态")
    public ResponseEntity<Map<String, Object>> getDatabaseInfo() {
        Map<String, Object> info = databaseMonitorService.getDatabaseInfo();
        return ResponseEntity.ok(info);
    }

    /**
     * 获取数据库性能指标
     */
    @GetMapping("/metrics")
    @Operation(summary = "获取性能指标", description = "获取数据库连接池的性能指标")
    public ResponseEntity<Map<String, Object>> getPerformanceMetrics() {
        Map<String, Object> metrics = databaseMonitorService.getPerformanceMetrics();
        return ResponseEntity.ok(metrics);
    }

    /**
     * 测试数据库连接
     */
    @GetMapping("/test-connection")
    @Operation(summary = "测试数据库连接", description = "测试数据库连接是否正常")
    public ResponseEntity<Map<String, Object>> testConnection() {
        boolean isConnected = databaseMonitorService.testConnection();
        Map<String, Object> result = Map.of(
            "connected", isConnected,
            "status", isConnected ? "SUCCESS" : "FAILED",
            "timestamp", System.currentTimeMillis()
        );
        return ResponseEntity.ok(result);
    }

    /**
     * 获取完整的数据库监控信息
     */
    @GetMapping("/full-status")
    @Operation(summary = "获取完整状态", description = "获取数据库的完整监控状态信息")
    public ResponseEntity<Map<String, Object>> getFullStatus() {
        Map<String, Object> fullStatus = Map.of(
            "connectionPool", databaseMonitorService.getConnectionPoolStatus(),
            "databaseInfo", databaseMonitorService.getDatabaseInfo(),
            "performanceMetrics", databaseMonitorService.getPerformanceMetrics(),
            "connectionTest", Map.of(
                "success", databaseMonitorService.testConnection(),
                "timestamp", System.currentTimeMillis()
            )
        );
        return ResponseEntity.ok(fullStatus);
    }
}
