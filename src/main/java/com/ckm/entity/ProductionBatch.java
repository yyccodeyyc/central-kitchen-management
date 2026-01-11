package com.ckm.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
    @Builder.Default
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
