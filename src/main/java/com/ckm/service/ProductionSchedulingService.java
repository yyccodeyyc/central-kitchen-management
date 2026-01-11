package com.ckm.service;

import com.ckm.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductionSchedulingService {

    @Autowired
    private ProductionOrderService productionOrderService;

    @Autowired
    private ProductionScheduleService productionScheduleService;

    @Autowired
    private ProductionBatchService productionBatchService;

    @Autowired
    private ProductionStepService productionStepService;

    /**
     * 自动生成生产排程
     */
    public List<ProductionSchedule> autoScheduleOrders(List<Long> orderIds, LocalDateTime startDate) {
        List<ProductionOrder> orders = orderIds.stream()
                .map(id -> productionOrderService.findById(id))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .filter(order -> order.getStatus() == ProductionOrder.OrderStatus.APPROVED)
                .sorted((a, b) -> {
                    // 按优先级和截止日期排序
                    if (a.getPriority() != b.getPriority()) {
                        return b.getPriority().ordinal() - a.getPriority().ordinal();
                    }
                    return a.getRequiredDate().compareTo(b.getRequiredDate());
                })
                .collect(Collectors.toList());

        List<ProductionSchedule> schedules = new ArrayList<>();
        LocalDateTime currentTime = startDate;

        for (ProductionOrder order : orders) {
            ProductionSchedule schedule = createScheduleForOrder(order, currentTime);
            if (schedule != null) {
                schedules.add(schedule);
                // 更新订单状态
                productionOrderService.scheduleOrder(order.getId(), schedule.getScheduledDate(), "系统自动排程");

                // 计算下一个时间段
                currentTime = calculateNextScheduleTime(schedule);
            }
        }

        return schedules;
    }

    /**
     * 为单个订单创建排程
     */
    private ProductionSchedule createScheduleForOrder(ProductionOrder order, LocalDateTime proposedTime) {
        // 获取生产标准信息
        ProductionStandard standard = order.getProductionStandard();
        if (standard == null) {
            return null;
        }

        // 查找可用生产线
        String productionLine = findAvailableProductionLine(proposedTime, standard.getCookingTime());

        if (productionLine == null) {
            // 如果当前时间段不可用，尝试下一个可用时间段
            proposedTime = findNextAvailableTimeSlot(proposedTime, standard.getCookingTime());
            productionLine = findAvailableProductionLine(proposedTime, standard.getCookingTime());
        }

        if (productionLine == null) {
            return null; // 无法安排
        }

        // 创建排程
        ProductionSchedule schedule = ProductionSchedule.builder()
                .scheduledDate(proposedTime)
                .startTime(proposedTime)
                .endTime(proposedTime.plusMinutes(standard.getCookingTime()))
                .productionLine(productionLine)
                .equipment(standard.getEquipmentRequired())
                .assignedStaff("待分配")
                .status(ProductionSchedule.ScheduleStatus.PLANNED)
                .capacityUtilization(calculateCapacityUtilization(standard.getCookingTime()))
                .notes("系统自动排程 - " + order.getOrderNumber())
                .createdBy("系统")
                .updatedBy("系统")
                .build();

        return productionScheduleService.save(schedule);
    }

    /**
     * 查找可用生产线
     */
    private String findAvailableProductionLine(LocalDateTime time, Integer durationMinutes) {
        // 模拟生产线列表（实际应该从配置或数据库获取）
        List<String> productionLines = Arrays.asList("生产线A", "生产线B", "生产线C");

        LocalDateTime endTime = time.plusMinutes(durationMinutes);

        for (String line : productionLines) {
            // 检查时间冲突
            List<ProductionSchedule> conflicts = productionScheduleService.findByProductionLineAndDate(line, time.toLocalDate());

            boolean hasConflict = conflicts.stream().anyMatch(schedule ->
                schedule.getStatus() != ProductionSchedule.ScheduleStatus.CANCELLED &&
                schedule.isOverlapping(createTempSchedule(line, time, endTime))
            );

            if (!hasConflict) {
                return line;
            }
        }

        return null;
    }

    /**
     * 查找下一个可用时间段
     */
    private LocalDateTime findNextAvailableTimeSlot(LocalDateTime currentTime, Integer durationMinutes) {
        // 尝试接下来的几个时间段
        LocalDateTime testTime = currentTime.plusHours(1);

        for (int i = 0; i < 24; i++) { // 最多尝试24小时
            if (findAvailableProductionLine(testTime, durationMinutes) != null) {
                return testTime;
            }
            testTime = testTime.plusHours(1);
        }

        return currentTime.plusDays(1).withHour(8); // 次日早上8点
    }

    /**
     * 计算产能利用率
     */
    private Double calculateCapacityUtilization(Integer cookingTime) {
        // 假设标准工作时间为8小时（480分钟）
        final int STANDARD_WORK_MINUTES = 480;
        return Math.min((double) cookingTime / STANDARD_WORK_MINUTES * 100.0, 100.0);
    }

    /**
     * 计算下一个排程时间
     */
    private LocalDateTime calculateNextScheduleTime(ProductionSchedule schedule) {
        // 在当前排程结束后15分钟开始下一个
        return schedule.getEndTime().plusMinutes(15);
    }

    /**
     * 创建临时排程用于冲突检查
     */
    private ProductionSchedule createTempSchedule(String productionLine, LocalDateTime startTime, LocalDateTime endTime) {
        return ProductionSchedule.builder()
                .productionLine(productionLine)
                .startTime(startTime)
                .endTime(endTime)
                .build();
    }

    /**
     * 优化现有排程
     */
    public List<ProductionSchedule> optimizeSchedules(LocalDateTime date) {
        List<ProductionSchedule> schedules = productionScheduleService.findByScheduledDate(date);

        // 简单的优化算法：重新排序以减少空闲时间
        schedules.sort((a, b) -> {
            // 优先级排序：紧急订单优先
            if (hasUrgentOrder(a) && !hasUrgentOrder(b)) return -1;
            if (!hasUrgentOrder(a) && hasUrgentOrder(b)) return 1;

            // 时间排序
            return a.getStartTime().compareTo(b.getStartTime());
        });

        return schedules;
    }

    /**
     * 检查排程是否包含紧急订单
     */
    private boolean hasUrgentOrder(ProductionSchedule schedule) {
        // 这里需要关联到具体的订单逻辑
        return false; // 简化实现
    }

    /**
     * 获取排程冲突报告
     */
    public List<String> getScheduleConflicts(LocalDateTime date) {
        List<String> conflicts = new ArrayList<>();
        List<ProductionSchedule> schedules = productionScheduleService.findByScheduledDate(date);

        for (int i = 0; i < schedules.size(); i++) {
            for (int j = i + 1; j < schedules.size(); j++) {
                ProductionSchedule s1 = schedules.get(i);
                ProductionSchedule s2 = schedules.get(j);

                if (s1.getProductionLine().equals(s2.getProductionLine()) && s1.isOverlapping(s2)) {
                    conflicts.add(String.format("冲突：%s 和 %s 在生产线 %s 时间重叠",
                            s1.getScheduleNumber(), s2.getScheduleNumber(), s1.getProductionLine()));
                }
            }
        }

        return conflicts;
    }

    /**
     * 获取产能利用率报告
     */
    public Map<String, Double> getCapacityUtilizationReport(LocalDateTime startDate, LocalDateTime endDate) {
        Map<String, Double> report = new HashMap<>();

        List<String> productionLines = Arrays.asList("生产线A", "生产线B", "生产线C");

        for (String line : productionLines) {
            Double avgUtilization = productionScheduleService.getAverageCapacityUtilization(
                    ProductionSchedule.ScheduleStatus.COMPLETED, startDate, endDate);
            report.put(line, avgUtilization != null ? avgUtilization : 0.0);
        }

        return report;
    }
}
