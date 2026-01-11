package com.ckm.controller;

import com.ckm.service.AnalyticsService;
import com.ckm.service.InventoryAlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @Autowired
    private InventoryAlertService inventoryAlertService;

    /**
     * 获取运营概览仪表板数据
     */
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getOperationalDashboard() {
        Map<String, Object> dashboard = analyticsService.getOperationalDashboard();
        return ResponseEntity.ok(dashboard);
    }

    /**
     * 获取生产效率分析
     */
    @GetMapping("/production-efficiency")
    public ResponseEntity<Map<String, Object>> getProductionEfficiency() {
        Map<String, Object> efficiency = analyticsService.getProductionEfficiency();
        return ResponseEntity.ok(efficiency);
    }

    /**
     * 获取成本分析
     */
    @GetMapping("/cost-analysis")
    public ResponseEntity<Map<String, Object>> getCostAnalysis() {
        Map<String, Object> costAnalysis = analyticsService.getCostAnalysis();
        return ResponseEntity.ok(costAnalysis);
    }

    /**
     * 获取质量指标分析
     */
    @GetMapping("/quality-metrics")
    public ResponseEntity<Map<String, Object>> getQualityMetrics() {
        Map<String, Object> qualityMetrics = analyticsService.getQualityMetrics();
        return ResponseEntity.ok(qualityMetrics);
    }

    /**
     * 获取门店运营分析
     */
    @GetMapping("/store-performance")
    public ResponseEntity<Map<String, Object>> getStorePerformance() {
        Map<String, Object> storePerformance = analyticsService.getStorePerformance();
        return ResponseEntity.ok(storePerformance);
    }

    /**
     * 生成月度报告
     */
    @GetMapping("/monthly-report/{year}/{month}")
    public ResponseEntity<Map<String, Object>> generateMonthlyReport(
            @PathVariable int year, @PathVariable int month) {
        Map<String, Object> report = analyticsService.generateMonthlyReport(year, month);
        return ResponseEntity.ok(report);
    }

    /**
     * 获取预测分析
     */
    @GetMapping("/predictive-analytics")
    public ResponseEntity<Map<String, Object>> getPredictiveAnalytics() {
        Map<String, Object> predictiveAnalytics = analyticsService.getPredictiveAnalytics();
        return ResponseEntity.ok(predictiveAnalytics);
    }

    /**
     * 获取库存预警信息
     */
    @GetMapping("/inventory-alerts")
    public ResponseEntity<Map<String, Object>> getInventoryAlerts() {
        Map<String, Object> alerts = inventoryAlertService.checkStockLevels();
        return ResponseEntity.ok(alerts);
    }

    /**
     * 获取需求预测
     */
    @GetMapping("/demand-prediction")
    public ResponseEntity<Map<String, Object>> getDemandPrediction() {
        Map<String, Object> prediction = inventoryAlertService.predictDemand();
        return ResponseEntity.ok(prediction);
    }

    /**
     * 获取补货预警
     */
    @GetMapping("/reorder-alerts")
    public ResponseEntity<Map<String, Object>> getReorderAlerts() {
        Map<String, Object> reorderAlerts = inventoryAlertService.generateReorderAlerts();
        return ResponseEntity.ok(reorderAlerts);
    }

    /**
     * 获取质量预警
     */
    @GetMapping("/quality-alerts")
    public ResponseEntity<Map<String, Object>> getQualityAlerts() {
        Map<String, Object> qualityAlerts = inventoryAlertService.getQualityAlerts();
        return ResponseEntity.ok(qualityAlerts);
    }

    /**
     * 获取综合预警报告
     */
    @GetMapping("/comprehensive-alert-report")
    public ResponseEntity<Map<String, Object>> getComprehensiveAlertReport() {
        Map<String, Object> report = inventoryAlertService.getComprehensiveAlertReport();
        return ResponseEntity.ok(report);
    }

    /**
     * 手动触发库存检查
     */
    @PostMapping("/inventory-check")
    public ResponseEntity<String> triggerInventoryCheck() {
        Map<String, Object> alerts = inventoryAlertService.checkStockLevels();
        return ResponseEntity.ok("库存检查完成，发现 " + alerts.get("totalAlerts") + " 个预警项目");
    }

    /**
     * 手动触发质量检查
     */
    @PostMapping("/quality-check")
    public ResponseEntity<String> triggerQualityCheck() {
        Map<String, Object> qualityAlerts = inventoryAlertService.getQualityAlerts();
        return ResponseEntity.ok("质量检查完成，发现 " + qualityAlerts.get("totalQualityAlerts") + " 个质量问题");
    }

    /**
     * 获取关键绩效指标(KPI)
     */
    @GetMapping("/kpis")
    public ResponseEntity<Map<String, Object>> getKPIs() {
        Map<String, Object> kpis = Map.of(
            "productionEfficiency", 88.9,
            "qualityPassRate", 96.5,
            "costPerUnit", 12.5,
            "customerSatisfaction", 4.6,
            "onTimeDelivery", 98.2,
            "inventoryTurnover", 12.3
        );
        return ResponseEntity.ok(kpis);
    }

    /**
     * 获取趋势分析
     */
    @GetMapping("/trends/{period}")
    public ResponseEntity<Map<String, Object>> getTrends(@PathVariable String period) {
        Map<String, Object> trends = Map.of(
            "period", period,
            "efficiencyTrend", Map.of(
                "current", 88.9,
                "previous", 86.7,
                "change", 2.2
            ),
            "costTrend", Map.of(
                "current", 12.5,
                "previous", 12.8,
                "change", -0.3
            ),
            "qualityTrend", Map.of(
                "current", 96.5,
                "previous", 95.8,
                "change", 0.7
            )
        );
        return ResponseEntity.ok(trends);
    }
}
