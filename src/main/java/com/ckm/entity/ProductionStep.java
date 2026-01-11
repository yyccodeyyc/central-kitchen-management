package com.ckm.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "production_steps")
public class ProductionStep {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "production_batch_id", nullable = false)
    private ProductionBatch productionBatch;

    @Column(nullable = false)
    private Integer stepNumber;

    @Column(nullable = false, length = 200)
    private String stepName;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String instructions;

    @Column(nullable = false)
    private Integer plannedDurationMinutes;

    private Integer actualDurationMinutes;

    @Column(nullable = false)
    private LocalDateTime plannedStartTime;

    private LocalDateTime actualStartTime;

    private LocalDateTime completedTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StepStatus status;

    @Column(length = 100)
    private String assignedStaff;

    @Column(length = 100)
    private String equipment;

    @Column(length = 500)
    private String qualityCheckpoints;

    @Column(length = 500)
    private String notes;

    @Column(length = 500)
    private String issues;

    @Enumerated(EnumType.STRING)
    private QualityResult qualityResult;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Column(length = 100)
    private String createdBy;

    @Column(length = 100)
    private String updatedBy;

    public enum StepStatus {
        PENDING("待开始"),
        IN_PROGRESS("进行中"),
        COMPLETED("已完成"),
        SKIPPED("已跳过"),
        FAILED("失败");

        private final String description;

        StepStatus(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    public enum QualityResult {
        PASS("合格"),
        FAIL("不合格"),
        PENDING("待检查"),
        NOT_REQUIRED("无需检查");

        private final String description;

        QualityResult(String description) {
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
            status = StepStatus.PENDING;
        }
        if (qualityResult == null) {
            qualityResult = QualityResult.PENDING;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // 业务方法
    public boolean isCompleted() {
        return status == StepStatus.COMPLETED;
    }

    public boolean isInProgress() {
        return status == StepStatus.IN_PROGRESS;
    }

    public boolean isQualityPassed() {
        return qualityResult == QualityResult.PASS || qualityResult == QualityResult.NOT_REQUIRED;
    }

    public int getDelayMinutes() {
        if (actualDurationMinutes == null || plannedDurationMinutes == null) {
            return 0;
        }
        return actualDurationMinutes - plannedDurationMinutes;
    }

    public Double getEfficiencyRate() {
        if (plannedDurationMinutes == null || plannedDurationMinutes == 0 || actualDurationMinutes == null) {
            return 0.0;
        }
        return (double) plannedDurationMinutes / actualDurationMinutes * 100.0;
    }

    public boolean canStart() {
        return status == StepStatus.PENDING;
    }

    public boolean canComplete() {
        return status == StepStatus.IN_PROGRESS;
    }
}
