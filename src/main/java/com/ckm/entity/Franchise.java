package main.java.com.ckm.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "franchises")
public class Franchise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "加盟商名称不能为空")
    @Column(nullable = false)
    private String name;

    @Column(name = "contact_person")
    private String contactPerson;

    @Column(name = "contact_phone")
    private String contactPhone;

    @Column
    private String address;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FranchiseStatus status = FranchiseStatus.ACTIVE;

    @Column(name = "created_at")
    private java.time.LocalDateTime createdAt;

    @Column(name = "updated_at")
    private java.time.LocalDateTime updatedAt;

    // Constructors
    public Franchise() {}

    public Franchise(String name, String contactPerson, String contactPhone, String address) {
        this.name = name;
        this.contactPerson = contactPerson;
        this.contactPhone = contactPhone;
        this.address = address;
        this.status = FranchiseStatus.ACTIVE;
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

    public FranchiseStatus getStatus() {
        return status;
    }

    public void setStatus(FranchiseStatus status) {
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

    public enum FranchiseStatus {
        ACTIVE("正常"),
        INACTIVE("停用"),
        SUSPENDED("暂停");

        private final String description;

        FranchiseStatus(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }
}
