package com.ckm.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "suppliers")
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "供应商名称不能为空")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "供应商分类不能为空")
    @Column(nullable = false)
    private String category; // 食材分类：蔬菜、肉类、水产等

    @NotBlank(message = "质量等级不能为空")
    @Column(nullable = false)
    private String qualityGrade; // A级、B级、C级

    @NotNull(message = "合同价格不能为空")
    @DecimalMin(value = "0.01", message = "合同价格必须大于0")
    @Column(nullable = false)
    private Double contractPrice;

    @NotNull(message = "配送周期不能为空")
    @Column(nullable = false)
    private Integer deliveryCycle; // 天数

    @Column
    private String contactPerson;

    @Column
    private String contactPhone;

    @Column
    private String address;

    @Column(columnDefinition = "TEXT")
    private String certificates; // 资质证书

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SupplierStatus status = SupplierStatus.ACTIVE;

    @Column
    private Double rating; // 评分 1-5

    @Column(name = "last_delivery_date")
    private java.time.LocalDate lastDeliveryDate;

    @Column(name = "created_at")
    private java.time.LocalDateTime createdAt;

    @Column(name = "updated_at")
    private java.time.LocalDateTime updatedAt;

    // Constructors
    public Supplier() {}

    public Supplier(String name, String category, String qualityGrade,
                   Double contractPrice, Integer deliveryCycle) {
        this.name = name;
        this.category = category;
        this.qualityGrade = qualityGrade;
        this.contractPrice = contractPrice;
        this.deliveryCycle = deliveryCycle;
        this.status = SupplierStatus.ACTIVE;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getQualityGrade() {
        return qualityGrade;
    }

    public void setQualityGrade(String qualityGrade) {
        this.qualityGrade = qualityGrade;
    }

    public Double getContractPrice() {
        return contractPrice;
    }

    public void setContractPrice(Double contractPrice) {
        this.contractPrice = contractPrice;
    }

    public Integer getDeliveryCycle() {
        return deliveryCycle;
    }

    public void setDeliveryCycle(Integer deliveryCycle) {
        this.deliveryCycle = deliveryCycle;
    }

    public String getContactPerson() {
        return contactPerson;
    }

    public void setContactPerson(String contactPerson) {
        this.contactPerson = contactPerson;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCertificates() {
        return certificates;
    }

    public void setCertificates(String certificates) {
        this.certificates = certificates;
    }

    public SupplierStatus getStatus() {
        return status;
    }

    public void setStatus(SupplierStatus status) {
        this.status = status;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public java.time.LocalDate getLastDeliveryDate() {
        return lastDeliveryDate;
    }

    public void setLastDeliveryDate(java.time.LocalDate lastDeliveryDate) {
        this.lastDeliveryDate = lastDeliveryDate;
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
    public boolean isOverdueForDelivery() {
        if (lastDeliveryDate == null) return true;
        return lastDeliveryDate.plusDays(deliveryCycle).isBefore(java.time.LocalDate.now());
    }

    public String getQualityGradeDescription() {
        switch (qualityGrade) {
            case "A": return "优质供应商";
            case "B": return "合格供应商";
            case "C": return "待改进供应商";
            default: return "未知等级";
        }
    }

    public enum SupplierStatus {
        ACTIVE("正常"),
        INACTIVE("停用"),
        BLACKLISTED("黑名单"),
        PENDING("待审核");

        private final String description;

        SupplierStatus(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }
}
