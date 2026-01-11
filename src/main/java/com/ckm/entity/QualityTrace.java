package com.ckm.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "quality_traces")
public class QualityTrace {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "批次号不能为空")
    @Column(nullable = false, unique = true)
    private String batchNumber;

    @NotBlank(message = "食材ID不能为空")
    @Column(nullable = false)
    private String ingredientId;

    @NotBlank(message = "食材名称不能为空")
    @Column(nullable = false)
    private String ingredientName;

    @NotNull(message = "生产日期不能为空")
    @Column(nullable = false)
    private java.time.LocalDate productionDate;

    @NotNull(message = "保质期不能为空")
    @Column(nullable = false)
    private java.time.LocalDate expiryDate;

    @NotBlank(message = "供应商信息不能为空")
    @Column(nullable = false)
    private String supplierInfo;

    @Column(columnDefinition = "TEXT")
    private String qualityCheck; // 质检记录

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QualityStatus status = QualityStatus.PENDING;

    @Column
    private String inspector; // 质检员

    @Column
    private String notes; // 备注

    @Column(name = "created_at")
    private java.time.LocalDateTime createdAt;

    @Column(name = "updated_at")
    private java.time.LocalDateTime updatedAt;

    // Constructors
    public QualityTrace() {}

    public QualityTrace(String batchNumber, String ingredientId, String ingredientName,
                       java.time.LocalDate productionDate, java.time.LocalDate expiryDate,
                       String supplierInfo) {
        this.batchNumber = batchNumber;
        this.ingredientId = ingredientId;
        this.ingredientName = ingredientName;
        this.productionDate = productionDate;
        this.expiryDate = expiryDate;
        this.supplierInfo = supplierInfo;
        this.status = QualityStatus.PENDING;
        this.createdAt = java.time.LocalDateTime.now();
        this.updatedAt = java.time.LocalDateTime.now();
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

    public String getIngredientId() {
        return ingredientId;
    }

    public void setIngredientId(String ingredientId) {
        this.ingredientId = ingredientId;
    }

    public String getIngredientName() {
        return ingredientName;
    }

    public void setIngredientName(String ingredientName) {
        this.ingredientName = ingredientName;
    }

    public java.time.LocalDate getProductionDate() {
        return productionDate;
    }

    public void setProductionDate(java.time.LocalDate productionDate) {
        this.productionDate = productionDate;
    }

    public java.time.LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(java.time.LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getSupplierInfo() {
        return supplierInfo;
    }

    public void setSupplierInfo(String supplierInfo) {
        this.supplierInfo = supplierInfo;
    }

    public String getQualityCheck() {
        return qualityCheck;
    }

    public void setQualityCheck(String qualityCheck) {
        this.qualityCheck = qualityCheck;
    }

    public QualityStatus getStatus() {
        return status;
    }

    public void setStatus(QualityStatus status) {
        this.status = status;
    }

    public String getInspector() {
        return inspector;
    }

    public void setInspector(String inspector) {
        this.inspector = inspector;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public java.time.LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(java.time.LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public java.time.LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(java.time.LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = java.time.LocalDateTime.now();
        updatedAt = java.time.LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = java.time.LocalDateTime.now();
    }

    // 业务方法
    public boolean isExpired() {
        return java.time.LocalDate.now().isAfter(expiryDate);
    }

    public boolean isExpiringSoon() {
        return java.time.LocalDate.now().plusDays(7).isAfter(expiryDate);
    }

    public enum QualityStatus {
        PENDING("待检"),
        PASSED("合格"),
        FAILED("不合格"),
        QUARANTINED("隔离");

        private final String description;

        QualityStatus(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }
}
