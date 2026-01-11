package com.ckm.repository;

import com.ckm.entity.ProductionBatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ProductionBatchRepository extends JpaRepository<ProductionBatch, Long> {

    List<ProductionBatch> findByProductionOrderIdOrderByStartTimeAsc(Long productionOrderId);

    List<ProductionBatch> findByProductionScheduleIdOrderByStartTimeAsc(Long productionScheduleId);

    List<ProductionBatch> findByStatusOrderByStartTimeAsc(ProductionBatch.BatchStatus status);

    @Query("SELECT pb FROM ProductionBatch pb WHERE pb.startTime BETWEEN :startDate AND :endDate ORDER BY pb.startTime ASC")
    List<ProductionBatch> findBatchesInDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT pb FROM ProductionBatch pb WHERE pb.status IN :statuses AND pb.endTime IS NULL ORDER BY pb.startTime ASC")
    List<ProductionBatch> findActiveBatches(@Param("statuses") List<ProductionBatch.BatchStatus> statuses);

    @Query("SELECT COUNT(pb) FROM ProductionBatch pb WHERE pb.status = :status AND pb.startTime BETWEEN :startDate AND :endDate")
    long countByStatusAndDateRange(@Param("status") ProductionBatch.BatchStatus status,
                                   @Param("startDate") LocalDateTime startDate,
                                   @Param("endDate") LocalDateTime endDate);

    @Query("SELECT AVG(pb.yieldRate) FROM ProductionBatch pb WHERE pb.status = :status AND pb.endTime BETWEEN :startDate AND :endDate")
    Double getAverageYieldRate(@Param("status") ProductionBatch.BatchStatus status,
                               @Param("startDate") LocalDateTime startDate,
                               @Param("endDate") LocalDateTime endDate);

    @Query("SELECT SUM(pb.totalCost) FROM ProductionBatch pb WHERE pb.status = :status AND pb.endTime BETWEEN :startDate AND :endDate")
    Double getTotalCostByStatusAndDateRange(@Param("status") ProductionBatch.BatchStatus status,
                                            @Param("startDate") LocalDateTime startDate,
                                            @Param("endDate") LocalDateTime endDate);

    boolean existsByBatchNumber(String batchNumber);

    @Query("SELECT pb FROM ProductionBatch pb WHERE pb.productionOrder.productionStandard.id = :standardId AND pb.status = :status")
    List<ProductionBatch> findByProductionStandardAndStatus(@Param("standardId") Long standardId, @Param("status") ProductionBatch.BatchStatus status);
}
