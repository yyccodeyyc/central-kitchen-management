package com.ckm.service;

import com.ckm.entity.ProductionStep;
import com.ckm.repository.ProductionStepRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProductionStepService {

    @Autowired
    private ProductionStepRepository productionStepRepository;

    public List<ProductionStep> findAll() {
        return productionStepRepository.findAll();
    }

    public Optional<ProductionStep> findById(Long id) {
        return productionStepRepository.findById(id);
    }

    public ProductionStep save(ProductionStep step) {
        // 设置计划开始时间
        if (step.getPlannedStartTime() == null) {
            step.setPlannedStartTime(LocalDateTime.now());
        }

        return productionStepRepository.save(step);
    }

    public void deleteById(Long id) {
        productionStepRepository.deleteById(id);
    }

    public List<ProductionStep> findByProductionBatchId(Long batchId) {
        return productionStepRepository.findByProductionBatchIdOrderByStepNumberAsc(batchId);
    }

    public List<ProductionStep> findByStatus(ProductionStep.StepStatus status) {
        return productionStepRepository.findByStatusOrderByPlannedStartTimeAsc(status);
    }

    public ProductionStep startStep(Long stepId, String assignedStaff, String equipment, String startedBy) {
        ProductionStep step = productionStepRepository.findById(stepId)
                .orElseThrow(() -> new RuntimeException("生产步骤不存在"));

        if (!step.canStart()) {
            throw new RuntimeException("步骤无法开始");
        }

        step.setStatus(ProductionStep.StepStatus.IN_PROGRESS);
        step.setAssignedStaff(assignedStaff);
        step.setEquipment(equipment);
        step.setActualStartTime(LocalDateTime.now());
        step.setUpdatedBy(startedBy);
        return productionStepRepository.save(step);
    }

    public ProductionStep completeStep(Long stepId, Integer actualDuration, ProductionStep.QualityResult qualityResult, String notes, String completedBy) {
        ProductionStep step = productionStepRepository.findById(stepId)
                .orElseThrow(() -> new RuntimeException("生产步骤不存在"));

        if (!step.canComplete()) {
            throw new RuntimeException("步骤无法完成");
        }

        step.setStatus(ProductionStep.StepStatus.COMPLETED);
        step.setActualDurationMinutes(actualDuration);
        step.setCompletedTime(LocalDateTime.now());
        step.setQualityResult(qualityResult);
        step.setNotes(notes);
        step.setUpdatedBy(completedBy);
        return productionStepRepository.save(step);
    }

    public ProductionStep skipStep(Long stepId, String reason, String skippedBy) {
        ProductionStep step = productionStepRepository.findById(stepId)
                .orElseThrow(() -> new RuntimeException("生产步骤不存在"));

        step.setStatus(ProductionStep.StepStatus.SKIPPED);
        step.setNotes(reason);
        step.setUpdatedBy(skippedBy);
        return productionStepRepository.save(step);
    }

    public ProductionStep failStep(Long stepId, String reason, String failedBy) {
        ProductionStep step = productionStepRepository.findById(stepId)
                .orElseThrow(() -> new RuntimeException("生产步骤不存在"));

        step.setStatus(ProductionStep.StepStatus.FAILED);
        step.setIssues(reason);
        step.setUpdatedBy(failedBy);
        return productionStepRepository.save(step);
    }

    public ProductionStep updateQualityResult(Long stepId, ProductionStep.QualityResult qualityResult, String inspector) {
        ProductionStep step = productionStepRepository.findById(stepId)
                .orElseThrow(() -> new RuntimeException("生产步骤不存在"));

        step.setQualityResult(qualityResult);
        step.setUpdatedBy(inspector);
        return productionStepRepository.save(step);
    }

    // 业务逻辑方法
    public boolean canBatchStart(Long batchId) {
        List<ProductionStep> steps = findByProductionBatchId(batchId);
        return steps.stream().allMatch(step -> step.getStatus() == ProductionStep.StepStatus.PENDING);
    }

    public boolean isBatchCompleted(Long batchId) {
        List<ProductionStep> steps = findByProductionBatchId(batchId);
        return steps.stream().allMatch(step -> step.isCompleted() || step.getStatus() == ProductionStep.StepStatus.SKIPPED);
    }

    public boolean hasBatchQualityIssues(Long batchId) {
        List<ProductionStep> steps = findByProductionBatchId(batchId);
        return steps.stream().anyMatch(step -> step.getQualityResult() == ProductionStep.QualityResult.FAIL);
    }

    public Double getBatchProgress(Long batchId) {
        List<ProductionStep> steps = findByProductionBatchId(batchId);
        if (steps.isEmpty()) return 0.0;

        long completedSteps = steps.stream()
                .filter(step -> step.isCompleted() || step.getStatus() == ProductionStep.StepStatus.SKIPPED)
                .count();

        return (double) completedSteps / steps.size() * 100.0;
    }

    // 统计方法
    public long countStepsByStatusAndDateRange(ProductionStep.StepStatus status,
                                              LocalDateTime startDate, LocalDateTime endDate) {
        return productionStepRepository.countByStatusAndDateRange(status, startDate, endDate);
    }

    public Double getAverageActualDuration(ProductionStep.StepStatus status,
                                          LocalDateTime startDate, LocalDateTime endDate) {
        return productionStepRepository.getAverageActualDuration(status, startDate, endDate);
    }

    public List<ProductionStep> findStepsByQualityResultAndDateRange(ProductionStep.QualityResult qualityResult,
                                                                    LocalDateTime startDate, LocalDateTime endDate) {
        return productionStepRepository.findStepsByQualityResultAndDateRange(qualityResult, startDate, endDate);
    }
}
