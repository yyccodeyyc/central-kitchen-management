package com.ckm.controller;

import com.ckm.entity.*;
import com.ckm.service.ProductionOrderService;
import com.ckm.service.ProductionScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/production")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductionManagementController {

    @Autowired
    private ProductionOrderService productionOrderService;

    @Autowired
    private ProductionScheduleService productionScheduleService;

    // ==================== 生产订单管理 ====================

    @GetMapping("/orders")
    public ResponseEntity<List<ProductionOrder>> getAllOrders() {
        return ResponseEntity.ok(productionOrderService.findAll());
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<ProductionOrder> getOrderById(@PathVariable Long id) {
        return productionOrderService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/orders")
    public ResponseEntity<ProductionOrder> createOrder(@RequestBody ProductionOrder order) {
        return ResponseEntity.ok(productionOrderService.save(order));
    }

    @PutMapping("/orders/{id}")
    public ResponseEntity<ProductionOrder> updateOrder(@PathVariable Long id, @RequestBody ProductionOrder order) {
        if (!productionOrderService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        order.setId(id);
        return ResponseEntity.ok(productionOrderService.save(order));
    }

    @DeleteMapping("/orders/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        if (!productionOrderService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        productionOrderService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/orders/status/{status}")
    public ResponseEntity<List<ProductionOrder>> getOrdersByStatus(@PathVariable ProductionOrder.OrderStatus status) {
        return ResponseEntity.ok(productionOrderService.findByStatus(status));
    }

    @GetMapping("/orders/pending")
    public ResponseEntity<List<ProductionOrder>> getPendingOrders() {
        return ResponseEntity.ok(productionOrderService.findPendingAndScheduledOrders());
    }

    @PostMapping("/orders/{id}/approve")
    public ResponseEntity<ProductionOrder> approveOrder(@PathVariable Long id, @RequestParam String approvedBy) {
        return ResponseEntity.ok(productionOrderService.approveOrder(id, approvedBy));
    }

    @PostMapping("/orders/{id}/schedule")
    public ResponseEntity<ProductionOrder> scheduleOrder(@PathVariable Long id,
                                                         @RequestParam String scheduledBy,
                                                         @RequestBody Map<String, String> payload) {
        LocalDateTime scheduledDate = LocalDateTime.parse(payload.get("scheduledDate"));
        return ResponseEntity.ok(productionOrderService.scheduleOrder(id, scheduledDate, scheduledBy));
    }

    @PostMapping("/orders/{id}/complete")
    public ResponseEntity<ProductionOrder> completeOrder(@PathVariable Long id, @RequestParam String completedBy) {
        return ResponseEntity.ok(productionOrderService.completeOrder(id, completedBy));
    }

    // ==================== 生产排程管理 ====================

    @GetMapping("/schedules")
    public ResponseEntity<List<ProductionSchedule>> getAllSchedules() {
        return ResponseEntity.ok(productionScheduleService.findAll());
    }

    @GetMapping("/schedules/{id}")
    public ResponseEntity<ProductionSchedule> getScheduleById(@PathVariable Long id) {
        return productionScheduleService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/schedules")
    public ResponseEntity<ProductionSchedule> createSchedule(@RequestBody ProductionSchedule schedule) {
        return ResponseEntity.ok(productionScheduleService.save(schedule));
    }

    @PutMapping("/schedules/{id}")
    public ResponseEntity<ProductionSchedule> updateSchedule(@PathVariable Long id, @RequestBody ProductionSchedule schedule) {
        if (!productionScheduleService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        schedule.setId(id);
        return ResponseEntity.ok(productionScheduleService.save(schedule));
    }

    @DeleteMapping("/schedules/{id}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable Long id) {
        if (!productionScheduleService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        productionScheduleService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/schedules/date/{date}")
    public ResponseEntity<List<ProductionSchedule>> getSchedulesByDate(@PathVariable String date) {
        LocalDateTime scheduledDate = LocalDateTime.parse(date);
        return ResponseEntity.ok(productionScheduleService.findByScheduledDate(scheduledDate));
    }

    @GetMapping("/schedules/line/{line}/date/{date}")
    public ResponseEntity<List<ProductionSchedule>> getSchedulesByLineAndDate(@PathVariable String line, @PathVariable String date) {
        LocalDateTime scheduledDate = LocalDateTime.parse(date);
        return ResponseEntity.ok(productionScheduleService.findByProductionLineAndDate(line, scheduledDate));
    }

    @PostMapping("/schedules/{id}/confirm")
    public ResponseEntity<ProductionSchedule> confirmSchedule(@PathVariable Long id, @RequestParam String confirmedBy) {
        return ResponseEntity.ok(productionScheduleService.confirmSchedule(id, confirmedBy));
    }

    @PostMapping("/schedules/{id}/start")
    public ResponseEntity<ProductionSchedule> startSchedule(@PathVariable Long id, @RequestParam String startedBy) {
        return ResponseEntity.ok(productionScheduleService.startSchedule(id, startedBy));
    }

    @PostMapping("/schedules/{id}/complete")
    public ResponseEntity<ProductionSchedule> completeSchedule(@PathVariable Long id, @RequestParam String completedBy) {
        return ResponseEntity.ok(productionScheduleService.completeSchedule(id, completedBy));
    }

    // ==================== 统计和分析 ====================

    @GetMapping("/stats/orders")
    public ResponseEntity<Map<String, Object>> getOrderStats(@RequestParam String startDate, @RequestParam String endDate) {
        LocalDateTime start = LocalDateTime.parse(startDate);
        LocalDateTime end = LocalDateTime.parse(endDate);

        Map<String, Object> stats = Map.of(
            "pendingOrders", productionOrderService.countOrdersByStatusAndDateRange(ProductionOrder.OrderStatus.PENDING, start, end),
            "completedOrders", productionOrderService.countOrdersByStatusAndDateRange(ProductionOrder.OrderStatus.COMPLETED, start, end),
            "totalAmount", productionOrderService.sumTotalAmountByStatusAndDateRange(ProductionOrder.OrderStatus.COMPLETED, start, end)
        );

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/stats/schedules")
    public ResponseEntity<Map<String, Object>> getScheduleStats(@RequestParam String startDate, @RequestParam String endDate) {
        LocalDateTime start = LocalDateTime.parse(startDate);
        LocalDateTime end = LocalDateTime.parse(endDate);

        Map<String, Object> stats = Map.of(
            "activeSchedules", productionScheduleService.findActiveSchedulesFromDate(start).size(),
            "averageUtilization", productionScheduleService.getAverageCapacityUtilization(ProductionSchedule.ScheduleStatus.COMPLETED, start, end)
        );

        return ResponseEntity.ok(stats);
    }
}
