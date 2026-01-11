package com.ckm.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMin;

@Entity
@Table(name = "production_standards")
public class ProductionStandard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "菜品名称不能为空")
    @Column(nullable = false)
    private String dishName;

    @NotBlank(message = "标准化配方不能为空")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String recipe;

    @NotNull(message = "标准重量不能为空")
    @DecimalMin(value = "0.01", message = "标准重量必须大于0")
    @Column(nullable = false)
    private Double standardWeight;

    @NotNull(message = "标准烹饪时间不能为空")
    @Column(nullable = false)
    private Integer cookingTime; // 分钟

    @NotBlank(message = "质量标准不能为空")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String qualityStandards;

    @Column
    private String preparationSteps; // 准备步骤

    @Column
    private String equipmentRequired; // 所需设备

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StandardStatus status = StandardStatus.ACTIVE;

    @Column(name = "created_at")
    private java.time.LocalDateTime createdAt;

    @Column(name = "updated_at")
    private java.time.LocalDateTime updatedAt;

    // Constructors
    public ProductionStandard() {}

    public ProductionStandard(String dishName, String recipe, Double standardWeight,
                            Integer cookingTime, String qualityStandards) {
        this.dishName = dishName;
        this.recipe = recipe;
        this.standardWeight = standardWeight;
        this.cookingTime = cookingTime;
        this.qualityStandards = qualityStandards;
        this.status = StandardStatus.ACTIVE;
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

    public String getDishName() {
        return dishName;
    }

    public void setDishName(String dishName) {
        this.dishName = dishName;
    }

    public String getRecipe() {
        return recipe;
    }

    public void setRecipe(String recipe) {
        this.recipe = recipe;
    }

    public Double getStandardWeight() {
        return standardWeight;
    }

    public void setStandardWeight(Double standardWeight) {
        this.standardWeight = standardWeight;
    }

    public Integer getCookingTime() {
        return cookingTime;
    }

    public void setCookingTime(Integer cookingTime) {
        this.cookingTime = cookingTime;
    }

    public String getQualityStandards() {
        return qualityStandards;
    }

    public void setQualityStandards(String qualityStandards) {
        this.qualityStandards = qualityStandards;
    }

    public String getPreparationSteps() {
        return preparationSteps;
    }

    public void setPreparationSteps(String preparationSteps) {
        this.preparationSteps = preparationSteps;
    }

    public String getEquipmentRequired() {
        return equipmentRequired;
    }

    public void setEquipmentRequired(String equipmentRequired) {
        this.equipmentRequired = equipmentRequired;
    }

    public StandardStatus getStatus() {
        return status;
    }

    public void setStatus(StandardStatus status) {
        this.status = status;
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

    public enum StandardStatus {
        ACTIVE("启用"),
        INACTIVE("停用"),
        DRAFT("草稿");

        private final String description;

        StandardStatus(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }
}
