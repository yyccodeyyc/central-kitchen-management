package com.ckm.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "production_batches")
public class ProductionBatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String batchNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "production_order_id", nullable = false)
    private ProductionOrder productionOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "production_schedule_id")
    private ProductionSchedule productionSchedule;

    @Column(nullable = false)
    private Integer plannedQuantity;

    private Integer actualQuantity;

    @Column(nullable = false)
    private LocalDateTime startTime;

    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BatchStatus status;

    @Column(precision = 5, scale = 2)
    private Double yieldRate; // 产出率

    @Column(precision = 10, scale = 2)
    private BigDecimal materialCost;

    @Column(precision = 10, scale = 2)
    private BigDecimal laborCost;

    @Column(precision = 10, scale = 2)
    private BigDecimal overheadCost;

    @Column(precision = 10, scale = 2)
    private BigDecimal totalCost;

    @OneToMany(mappedBy = "productionBatch", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductionStep> steps = new ArrayList<>();

    @Column(length = 500)
    private String qualityNotes;

    @Column(length = 500)
    private String issues;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Column(length = 100)
    private String createdBy;

    @Column(length = 100)
    private String updatedBy;

    public enum BatchStatus {
        PLANNED("已规划"),
        PREPARING("准备中"),
        IN_PROGRESS("生产中"),
        QUALITY_CHECK("质检中"),
        COMPLETED("已完成"),
        REJECTED("已驳回"),
        ON_HOLD("暂停");

        private final String description;

        BatchStatus(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = BatchStatus.PLANNED;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBatchNumber() {
        return batchNumber;
    }

    public void setBatchNumber(String batchNumber) {
        this.batchNumber = batchNumber;
    }

    public ProductionOrder getProductionOrder() {
        return productionOrder;
    }

    public void setProductionOrder(ProductionOrder productionOrder) {
        this.productionOrder = productionOrder;
    }

    public ProductionSchedule getProductionSchedule() {
        return productionSchedule;
    }

    public void setProductionSchedule(ProductionSchedule productionSchedule) {
        this.productionSchedule = productionSchedule;
    }

    public Integer getPlannedQuantity() {
        return plannedQuantity;
    }

    public void setPlannedQuantity(Integer plannedQuantity) {
        this.plannedQuantity = plannedQuantity;
    }

    public Integer getActualQuantity() {
        return actualQuantity;
    }

    public void setActualQuantity(Integer actualQuantity) {
        this.actualQuantity = actualQuantity;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public BatchStatus getStatus() {
        return status;
    }

    public void setStatus(BatchStatus status) {
        this.status = status;
    }

    public Double getYieldRate() {
        return yieldRate;
    }

    public void setYieldRate(Double yieldRate) {
        this.yieldRate = yieldRate;
    }

    public BigDecimal getMaterialCost() {
        return materialCost;
    }

    public void setMaterialCost(BigDecimal materialCost) {
        this.materialCost = materialCost;
    }

    public BigDecimal getLaborCost() {
        return laborCost;
    }

    public void setLaborCost(BigDecimal laborCost) {
        this.laborCost = laborCost;
    }

    public BigDecimal getOverheadCost() {
        return overheadCost;
    }

    public void setOverheadCost(BigDecimal overheadCost) {
        this.overheadCost = overheadCost;
    }

    public BigDecimal getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(BigDecimal totalCost) {
        this.totalCost = totalCost;
    }

    public List<ProductionStep> getSteps() {
        return steps;
    }

    public void setSteps(List<ProductionStep> steps) {
        this.steps = steps;
    }

    public String getQualityNotes() {
        return qualityNotes;
    }

    public void setQualityNotes(String qualityNotes) {
        this.qualityNotes = qualityNotes;
    }

    public String getIssues() {
        return issues;
    }

    public void setIssues(String issues) {
        this.issues = issues;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

    // 业务方法
    public boolean isCompleted() {
        return status == BatchStatus.COMPLETED;
    }

    public boolean isInProgress() {
        return status == BatchStatus.IN_PROGRESS || status == BatchStatus.PREPARING || status == BatchStatus.QUALITY_CHECK;
    }

    public int getActualDurationMinutes() {
        if (endTime == null || startTime == null) {
            return 0;
        }
        return (int) java.time.Duration.between(startTime, endTime).toMinutes();
    }

    public BigDecimal getCostPerUnit() {
        if (actualQuantity == null || actualQuantity == 0 || totalCost == null) {
            return BigDecimal.ZERO;
        }
        return totalCost.divide(BigDecimal.valueOf(actualQuantity), 2, java.math.RoundingMode.HALF_UP);
    }

    public Double getEfficiencyRate() {
        if (plannedQuantity == null || plannedQuantity == 0 || actualQuantity == null) {
            return 0.0;
        }
        return (double) actualQuantity / plannedQuantity * 100.0;
    }
}
