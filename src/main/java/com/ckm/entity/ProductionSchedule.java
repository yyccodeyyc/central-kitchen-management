package com.ckm.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "production_schedules")
public class ProductionSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String scheduleNumber;

    @Column(nullable = false)
    private LocalDateTime scheduledDate;

    @Column(nullable = false)
    private LocalDateTime startTime;

    @Column(nullable = false)
    private LocalDateTime endTime;

    @Column(nullable = false)
    private String productionLine;

    @Column(length = 100)
    private String equipment;

    @Column(length = 100)
    private String assignedStaff;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ScheduleStatus status;

    @Column(precision = 5, scale = 2)
    private Double capacityUtilization; // 产能利用率百分比

    @OneToMany(mappedBy = "productionSchedule", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<ProductionBatch> batches = new ArrayList<>();

    @Column(length = 500)
    private String notes;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Column(length = 100)
    private String createdBy;

    @Column(length = 100)
    private String updatedBy;

    public enum ScheduleStatus {
        PLANNED("已规划"),
        CONFIRMED("已确认"),
        IN_PROGRESS("进行中"),
        COMPLETED("已完成"),
        CANCELLED("已取消");

        private final String description;

        ScheduleStatus(String description) {
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
            status = ScheduleStatus.PLANNED;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // 业务方法
    public boolean isOverlapping(ProductionSchedule other) {
        return this.productionLine.equals(other.productionLine) &&
               this.scheduledDate.toLocalDate().equals(other.scheduledDate.toLocalDate()) &&
               this.startTime.isBefore(other.endTime) &&
               this.endTime.isAfter(other.startTime);
    }

    public int getDurationMinutes() {
        return (int) java.time.Duration.between(startTime, endTime).toMinutes();
    }

    public boolean isActive() {
        return status == ScheduleStatus.CONFIRMED || status == ScheduleStatus.IN_PROGRESS;
    }
}
