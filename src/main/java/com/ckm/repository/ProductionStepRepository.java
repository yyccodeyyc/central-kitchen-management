package com.ckm.repository;

import com.ckm.entity.ProductionStep;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ProductionStepRepository extends JpaRepository<ProductionStep, Long> {

    List<ProductionStep> findByProductionBatchIdOrderByStepNumberAsc(Long productionBatchId);

    List<ProductionStep> findByStatusOrderByPlannedStartTimeAsc(ProductionStep.StepStatus status);

    List<ProductionStep> findByAssignedStaffAndStatus(String assignedStaff, ProductionStep.StepStatus status);

    @Query("SELECT ps FROM ProductionStep ps WHERE ps.productionBatch.id = :batchId AND ps.status IN :statuses ORDER BY ps.stepNumber ASC")
    List<ProductionStep> findStepsByBatchAndStatuses(@Param("batchId") Long batchId, @Param("statuses") List<ProductionStep.StepStatus> statuses);

    @Query("SELECT ps FROM ProductionStep ps WHERE ps.plannedStartTime BETWEEN :startDate AND :endDate ORDER BY ps.plannedStartTime ASC")
    List<ProductionStep> findStepsInDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COUNT(ps) FROM ProductionStep ps WHERE ps.status = :status AND ps.actualStartTime BETWEEN :startDate AND :endDate")
    long countByStatusAndDateRange(@Param("status") ProductionStep.StepStatus status,
                                   @Param("startDate") LocalDateTime startDate,
                                   @Param("endDate") LocalDateTime endDate);

    @Query("SELECT AVG(ps.actualDurationMinutes) FROM ProductionStep ps WHERE ps.status = :status AND ps.completedTime BETWEEN :startDate AND :endDate")
    Double getAverageActualDuration(@Param("status") ProductionStep.StepStatus status,
                                    @Param("startDate") LocalDateTime startDate,
                                    @Param("endDate") LocalDateTime endDate);

    @Query("SELECT ps FROM ProductionStep ps WHERE ps.qualityResult = :qualityResult AND ps.completedTime BETWEEN :startDate AND :endDate")
    List<ProductionStep> findStepsByQualityResultAndDateRange(@Param("qualityResult") ProductionStep.QualityResult qualityResult,
                                                              @Param("startDate") LocalDateTime startDate,
                                                              @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COUNT(ps) FROM ProductionStep ps WHERE ps.productionBatch.productionOrder.productionStandard.id = :standardId AND ps.status = :status")
    long countStepsByProductionStandardAndStatus(@Param("standardId") Long standardId, @Param("status") ProductionStep.StepStatus status);

    @Query("SELECT ps FROM ProductionStep ps WHERE ps.equipment = :equipment AND ps.actualStartTime BETWEEN :startDate AND :endDate ORDER BY ps.actualStartTime ASC")
    List<ProductionStep> findStepsByEquipmentAndDateRange(@Param("equipment") String equipment,
                                                          @Param("startDate") LocalDateTime startDate,
                                                          @Param("endDate") LocalDateTime endDate);
}
