package com.ckm.service;

import com.ckm.entity.ProductionBatch;
import com.ckm.entity.ProductionOrder;
import com.ckm.entity.ProductionSchedule;
import com.ckm.repository.ProductionBatchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProductionBatchService {

    @Autowired
    private ProductionBatchRepository productionBatchRepository;

    public List<ProductionBatch> findAll() {
        return productionBatchRepository.findAll();
    }

    public Optional<ProductionBatch> findById(Long id) {
        return productionBatchRepository.findById(id);
    }

    public ProductionBatch save(ProductionBatch batch) {
        // 生成批次编号
        if (batch.getBatchNumber() == null) {
            batch.setBatchNumber(generateBatchNumber());
        }

        // 设置开始时间
        if (batch.getStartTime() == null) {
            batch.setStartTime(LocalDateTime.now());
        }

        return productionBatchRepository.save(batch);
    }

    public void deleteById(Long id) {
        productionBatchRepository.deleteById(id);
    }

    public List<ProductionBatch> findByProductionOrderId(Long orderId) {
        return productionBatchRepository.findByProductionOrderIdOrderByStartTimeAsc(orderId);
    }

    public List<ProductionBatch> findByStatus(ProductionBatch.BatchStatus status) {
        return productionBatchRepository.findByStatusOrderByStartTimeAsc(status);
    }

    public ProductionBatch startBatch(Long batchId, String startedBy) {
        ProductionBatch batch = productionBatchRepository.findById(batchId)
                .orElseThrow(() -> new RuntimeException("生产批次不存在"));

        batch.setStatus(ProductionBatch.BatchStatus.IN_PROGRESS);
        batch.setActualStartTime(LocalDateTime.now());
        batch.setUpdatedBy(startedBy);
        return productionBatchRepository.save(batch);
    }

    public ProductionBatch completeBatch(Long batchId, Integer actualQuantity, String completedBy) {
        ProductionBatch batch = productionBatchRepository.findById(batchId)
                .orElseThrow(() -> new RuntimeException("生产批次不存在"));

        batch.setStatus(ProductionBatch.BatchStatus.COMPLETED);
        batch.setActualQuantity(actualQuantity);
        batch.setEndTime(LocalDateTime.now());
        batch.setYieldRate(calculateYieldRate(batch.getPlannedQuantity(), actualQuantity));
        batch.setUpdatedBy(completedBy);
        return productionBatchRepository.save(batch);
    }

    public ProductionBatch pauseBatch(Long batchId, String pausedBy) {
        ProductionBatch batch = productionBatchRepository.findById(batchId)
                .orElseThrow(() -> new RuntimeException("生产批次不存在"));

        batch.setStatus(ProductionBatch.BatchStatus.ON_HOLD);
        batch.setUpdatedBy(pausedBy);
        return productionBatchRepository.save(batch);
    }

    public ProductionBatch resumeBatch(Long batchId, String resumedBy) {
        ProductionBatch batch = productionBatchRepository.findById(batchId)
                .orElseThrow(() -> new RuntimeException("生产批次不存在"));

        batch.setStatus(ProductionBatch.BatchStatus.IN_PROGRESS);
        batch.setUpdatedBy(resumedBy);
        return productionBatchRepository.save(batch);
    }

    public ProductionBatch rejectBatch(Long batchId, String rejectedBy, String reason) {
        ProductionBatch batch = productionBatchRepository.findById(batchId)
                .orElseThrow(() -> new RuntimeException("生产批次不存在"));

        batch.setStatus(ProductionBatch.BatchStatus.REJECTED);
        batch.setIssues(reason);
        batch.setEndTime(LocalDateTime.now());
        batch.setUpdatedBy(rejectedBy);
        return productionBatchRepository.save(batch);
    }

    public boolean existsByBatchNumber(String batchNumber) {
        return productionBatchRepository.existsByBatchNumber(batchNumber);
    }

    private String generateBatchNumber() {
        LocalDateTime now = LocalDateTime.now();
        String dateStr = now.format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd"));
        String sequence = String.format("%04d", getNextSequenceNumber());
        return "PB" + dateStr + sequence;
    }

    private int getNextSequenceNumber() {
        LocalDateTime today = LocalDateTime.now().toLocalDate().atStartOfDay();
        LocalDateTime tomorrow = today.plusDays(1);

        long count = productionBatchRepository.findBatchesInDateRange(today, tomorrow).size();
        return (int) count + 1;
    }

    private Double calculateYieldRate(Integer planned, Integer actual) {
        if (planned == null || planned == 0 || actual == null) {
            return 0.0;
        }
        return (double) actual / planned * 100.0;
    }

    // 统计方法
    public long countBatchesByStatusAndDateRange(ProductionBatch.BatchStatus status,
                                                LocalDateTime startDate, LocalDateTime endDate) {
        return productionBatchRepository.countByStatusAndDateRange(status, startDate, endDate);
    }

    public Double getAverageYieldRate(ProductionBatch.BatchStatus status,
                                     LocalDateTime startDate, LocalDateTime endDate) {
        return productionBatchRepository.getAverageYieldRate(status, startDate, endDate);
    }

    public Double getTotalCostByStatusAndDateRange(ProductionBatch.BatchStatus status,
                                                  LocalDateTime startDate, LocalDateTime endDate) {
        Double totalCost = productionBatchRepository.getTotalCostByStatusAndDateRange(status, startDate, endDate);
        return totalCost != null ? totalCost : 0.0;
    }
}
