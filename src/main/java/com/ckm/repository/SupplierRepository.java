package com.ckm.repository;

import com.ckm.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {

    /**
     * 根据供应商名称查找
     */
    Supplier findByName(String name);

    /**
     * 根据分类查找供应商
     */
    List<Supplier> findByCategory(String category);

    /**
     * 根据质量等级查找供应商
     */
    List<Supplier> findByQualityGrade(String qualityGrade);

    /**
     * 根据状态查找供应商
     */
    List<Supplier> findByStatus(Supplier.SupplierStatus status);

    /**
     * 查找优质供应商（A级）
     */
    List<Supplier> findByQualityGradeAndStatus(String qualityGrade, Supplier.SupplierStatus status);

    /**
     * 根据评分范围查找供应商
     */
    @Query("SELECT s FROM Supplier s WHERE s.rating BETWEEN :minRating AND :maxRating")
    List<Supplier> findByRatingRange(@Param("minRating") Double minRating, @Param("maxRating") Double maxRating);

    /**
     * 查找需要配送的供应商（超过配送周期）
     */
    @Query("SELECT s FROM Supplier s WHERE s.lastDeliveryDate IS NULL OR s.lastDeliveryDate < :checkDate")
    List<Supplier> findOverdueForDelivery(@Param("checkDate") LocalDate checkDate);

    /**
     * 根据联系人查找供应商
     */
    List<Supplier> findByContactPerson(String contactPerson);

    /**
     * 根据联系电话查找供应商
     */
    List<Supplier> findByContactPhone(String contactPhone);

    /**
     * 统计各分类的供应商数量
     */
    @Query("SELECT s.category, COUNT(s) FROM Supplier s GROUP BY s.category")
    List<Object[]> countByCategory();

    /**
     * 统计各质量等级的供应商数量
     */
    @Query("SELECT s.qualityGrade, COUNT(s) FROM Supplier s GROUP BY s.qualityGrade")
    List<Object[]> countByQualityGrade();

    /**
     * 查找有资质证书的供应商
     */
    @Query("SELECT s FROM Supplier s WHERE s.certificates IS NOT NULL AND s.certificates != ''")
    List<Supplier> findWithCertificates();

    /**
     * 根据地址模糊查找供应商
     */
    List<Supplier> findByAddressContaining(String address);

    /**
     * 获取供应商平均评分
     */
    @Query("SELECT AVG(s.rating) FROM Supplier s WHERE s.rating IS NOT NULL")
    Double getAverageRating();

    /**
     * 查找评分最高的供应商
     */
    @Query("SELECT s FROM Supplier s WHERE s.rating IS NOT NULL ORDER BY s.rating DESC")
    List<Supplier> findTopRatedSuppliers();
}
