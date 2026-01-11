package com.ckm.service;

import com.ckm.entity.ProductionOrder;
import com.ckm.entity.ProductionStandard;
import com.ckm.repository.ProductionOrderRepository;
import com.ckm.repository.ProductionStandardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProductionOrderService {

    @Autowired
    private ProductionOrderRepository productionOrderRepository;

    @Autowired
    private ProductionStandardRepository productionStandardRepository;

    public List<ProductionOrder> findAll() {
        return productionOrderRepository.findAll();
    }

    public Optional<ProductionOrder> findById(Long id) {
        return productionOrderRepository.findById(id);
    }

    public ProductionOrder save(ProductionOrder productionOrder) {
        // 生成订单编号
        if (productionOrder.getOrderNumber() == null) {
            productionOrder.setOrderNumber(generateOrderNumber());
        }

        // 计算总金额
        if (productionOrder.getUnitPrice() != null && productionOrder.getQuantity() != null) {
            BigDecimal totalAmount = productionOrder.getUnitPrice()
                    .multiply(BigDecimal.valueOf(productionOrder.getQuantity()));
            productionOrder.setTotalAmount(totalAmount);
        }

        return productionOrderRepository.save(productionOrder);
    }

    public void deleteById(Long id) {
        productionOrderRepository.deleteById(id);
    }

    public List<ProductionOrder> findByFranchiseId(Long franchiseId) {
        return productionOrderRepository.findByFranchiseIdOrderByOrderDateDesc(franchiseId);
    }

    public List<ProductionOrder> findByStatus(ProductionOrder.OrderStatus status) {
        return productionOrderRepository.findByStatusOrderByPriorityDescRequiredDateAsc(status);
    }

    public List<ProductionOrder> findPendingAndScheduledOrders() {
        return productionOrderRepository.findPendingAndScheduledOrders(
                List.of(ProductionOrder.OrderStatus.PENDING, ProductionOrder.OrderStatus.SCHEDULED));
    }

    public List<ProductionOrder> findByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return productionOrderRepository.findByRequiredDateBetweenOrderByRequiredDateAsc(startDate, endDate);
    }

    public ProductionOrder approveOrder(Long orderId, String approvedBy) {
        ProductionOrder order = productionOrderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("生产订单不存在"));

        order.setStatus(ProductionOrder.OrderStatus.APPROVED);
        order.setUpdatedBy(approvedBy);
        return productionOrderRepository.save(order);
    }

    public ProductionOrder scheduleOrder(Long orderId, LocalDateTime scheduledDate, String scheduledBy) {
        ProductionOrder order = productionOrderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("生产订单不存在"));

        order.setStatus(ProductionOrder.OrderStatus.SCHEDULED);
        order.setScheduledDate(scheduledDate);
        order.setUpdatedBy(scheduledBy);
        return productionOrderRepository.save(order);
    }

    public ProductionOrder completeOrder(Long orderId, String completedBy) {
        ProductionOrder order = productionOrderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("生产订单不存在"));

        order.setStatus(ProductionOrder.OrderStatus.COMPLETED);
        order.setCompletedDate(LocalDateTime.now());
        order.setUpdatedBy(completedBy);
        return productionOrderRepository.save(order);
    }

    public ProductionOrder cancelOrder(Long orderId, String cancelledBy) {
        ProductionOrder order = productionOrderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("生产订单不存在"));

        order.setStatus(ProductionOrder.OrderStatus.CANCELLED);
        order.setUpdatedBy(cancelledBy);
        return productionOrderRepository.save(order);
    }

    public boolean existsByOrderNumber(String orderNumber) {
        return productionOrderRepository.existsByOrderNumber(orderNumber);
    }

    private String generateOrderNumber() {
        LocalDateTime now = LocalDateTime.now();
        String dateStr = now.format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd"));
        String sequence = String.format("%04d", getNextSequenceNumber());
        return "PO" + dateStr + sequence;
    }

    private int getNextSequenceNumber() {
        LocalDateTime today = LocalDateTime.now().toLocalDate().atStartOfDay();
        LocalDateTime tomorrow = today.plusDays(1);

        long count = productionOrderRepository.countByStatusAndDateRange(
                ProductionOrder.OrderStatus.PENDING, today, tomorrow);

        return (int) count + 1;
    }

    // 统计方法
    public long countOrdersByStatusAndDateRange(ProductionOrder.OrderStatus status,
                                                LocalDateTime startDate, LocalDateTime endDate) {
        return productionOrderRepository.countByStatusAndDateRange(status, startDate, endDate);
    }

    public Double sumTotalAmountByStatusAndDateRange(ProductionOrder.OrderStatus status,
                                                     LocalDateTime startDate, LocalDateTime endDate) {
        return productionOrderRepository.sumTotalAmountByStatusAndDateRange(status, startDate, endDate);
    }
}
