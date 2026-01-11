package com.ckm.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import com.ckm.entity.QualityTrace;
import com.ckm.repository.QualityTraceRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class InventoryAlertService {

    @Autowired
    private QualityTraceRepository qualityTraceRepository;

    /**
     * 检查库存水平并生成预警
     */
    public Map<String, Object> checkStockLevels() {
        Map<String, Object> result = new HashMap<>();

        // 检查过期食材
        List<QualityTrace> expiredItems = qualityTraceRepository.findAll().stream()
            .filter(QualityTrace::isExpired)
            .toList();

        // 检查即将过期食材（7天内）
        List<QualityTrace> expiringSoonItems = qualityTraceRepository.findAll().stream()
            .filter(item -> !item.isExpired() && item.isExpiringSoon())
            .toList();

        // 检查低库存食材（这里需要根据实际库存表来实现）
        // 暂时使用模拟数据
        List<String> lowStockItems = List.of("大白菜", "猪肉", "鸡蛋");

        result.put("expiredItems", expiredItems);
        result.put("expiringSoonItems", expiringSoonItems);
        result.put("lowStockItems", lowStockItems);
        result.put("totalAlerts", expiredItems.size() + expiringSoonItems.size() + lowStockItems.size());

        return result;
    }

    /**
     * 预测需求并生成补货建议
     */
    public Map<String, Object> predictDemand() {
        Map<String, Object> result = new HashMap<>();

        // 基于历史数据预测需求（这里需要实现具体的预测算法）
        // 暂时返回示例数据
        Map<String, Integer> predictedDemand = new HashMap<>();
        predictedDemand.put("大白菜", 500);
        predictedDemand.put("猪肉", 200);
        predictedDemand.put("鸡蛋", 300);
        predictedDemand.put("米饭", 1000);

        result.put("predictedDemand", predictedDemand);
        result.put("nextWeekTotal", predictedDemand.values().stream().mapToInt(Integer::intValue).sum());

        return result;
    }

    /**
     * 生成补货预警
     */
    public Map<String, Object> generateReorderAlerts() {
        Map<String, Object> result = new HashMap<>();

        // 分析当前库存 vs 安全库存水平
        Map<String, Object> reorderItems = new HashMap<>();

        // 示例数据 - 需要连接实际库存表
        reorderItems.put("大白菜", Map.of(
            "currentStock", 50,
            "safetyStock", 100,
            "suggestedOrder", 200,
            "supplier", "本地蔬菜供应商",
            "urgency", "高"
        ));

        reorderItems.put("猪肉", Map.of(
            "currentStock", 30,
            "safetyStock", 80,
            "suggestedOrder", 150,
            "supplier", "肉类供应商A",
            "urgency", "高"
        ));

        result.put("reorderItems", reorderItems);
        result.put("totalReorderAlerts", reorderItems.size());

        return result;
    }

    /**
     * 获取质量预警信息
     */
    public Map<String, Object> getQualityAlerts() {
        Map<String, Object> result = new HashMap<>();

        List<QualityTrace> failedInspections = qualityTraceRepository.findAll().stream()
            .filter(item -> item.getStatus() == QualityTrace.QualityStatus.FAILED)
            .toList();

        List<QualityTrace> quarantinedItems = qualityTraceRepository.findAll().stream()
            .filter(item -> item.getStatus() == QualityTrace.QualityStatus.QUARANTINED)
            .toList();

        result.put("failedInspections", failedInspections);
        result.put("quarantinedItems", quarantinedItems);
        result.put("totalQualityAlerts", failedInspections.size() + quarantinedItems.size());

        return result;
    }

    /**
     * 获取综合预警报告
     */
    public Map<String, Object> getComprehensiveAlertReport() {
        Map<String, Object> report = new HashMap<>();

        report.put("inventoryAlerts", checkStockLevels());
        report.put("demandPrediction", predictDemand());
        report.put("reorderAlerts", generateReorderAlerts());
        report.put("qualityAlerts", getQualityAlerts());
        report.put("generatedAt", LocalDate.now());

        return report;
    }

    /**
     * 定时任务：每日库存检查
     * 每天早上8点执行
     */
    @Scheduled(cron = "0 0 8 * * ?")
    public void dailyInventoryCheck() {
        Map<String, Object> alerts = checkStockLevels();

        // 这里可以发送邮件通知或系统消息
        // sendAlertNotification(alerts);

        System.out.println("每日库存检查完成，发现 " +
            alerts.get("totalAlerts") + " 个预警项目");
    }

    /**
     * 定时任务：每周质量检查
     * 每周一早上9点执行
     */
    @Scheduled(cron = "0 0 9 ? * MON")
    public void weeklyQualityCheck() {
        Map<String, Object> qualityAlerts = getQualityAlerts();

        System.out.println("每周质量检查完成，发现 " +
            qualityAlerts.get("totalQualityAlerts") + " 个质量问题");
    }
}
