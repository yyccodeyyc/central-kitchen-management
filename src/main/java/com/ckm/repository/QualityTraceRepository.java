package com.ckm.repository;

import com.ckm.entity.QualityTrace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface QualityTraceRepository extends JpaRepository<QualityTrace, Long> {

    /**
     * 根据批次号查找质量追溯记录
     */
    QualityTrace findByBatchNumber(String batchNumber);

    /**
     * 根据食材ID查找质量追溯记录
     */
    List<QualityTrace> findByIngredientId(String ingredientId);

    /**
     * 根据食材名称查找质量追溯记录
     */
    List<QualityTrace> findByIngredientName(String ingredientName);

    /**
     * 根据质量状态查找记录
     */
    List<QualityTrace> findByStatus(QualityTrace.QualityStatus status);

    /**
     * 查找即将过期食材（7天内）
     */
    @Query("SELECT q FROM QualityTrace q WHERE q.expiryDate <= :expiryDate AND q.status = 'PASSED'")
    List<QualityTrace> findExpiringSoon(@Param("expiryDate") LocalDate expiryDate);

    /**
     * 查找已过期食材
     */
    @Query("SELECT q FROM QualityTrace q WHERE q.expiryDate < :currentDate")
    List<QualityTrace> findExpired(@Param("currentDate") LocalDate currentDate);

    /**
     * 根据供应商查找质量追溯记录
     */
    List<QualityTrace> findBySupplierInfoContaining(String supplierInfo);

    /**
     * 查找指定日期范围内的记录
     */
    List<QualityTrace> findByProductionDateBetween(LocalDate startDate, LocalDate endDate);

    /**
     * 统计各质量状态的数量
     */
    @Query("SELECT q.status, COUNT(q) FROM QualityTrace q GROUP BY q.status")
    List<Object[]> countByStatus();

    /**
     * 查找需要重新质检的记录
     */
    @Query("SELECT q FROM QualityTrace q WHERE q.status IN ('PENDING', 'QUARANTINED')")
    List<QualityTrace> findPendingInspections();

    /**
     * 根据质检员查找记录
     */
    List<QualityTrace> findByInspector(String inspector);
}
