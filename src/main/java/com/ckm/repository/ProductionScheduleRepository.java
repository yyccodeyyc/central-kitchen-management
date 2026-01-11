package com.ckm.repository;

import com.ckm.entity.ProductionSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ProductionScheduleRepository extends JpaRepository<ProductionSchedule, Long> {

    List<ProductionSchedule> findByScheduledDateOrderByStartTimeAsc(LocalDateTime scheduledDate);

    List<ProductionSchedule> findByProductionLineAndScheduledDateOrderByStartTimeAsc(String productionLine, LocalDateTime scheduledDate);

    List<ProductionSchedule> findByStatusOrderByScheduledDateAscStartTimeAsc(ProductionSchedule.ScheduleStatus status);

    @Query("SELECT ps FROM ProductionSchedule ps WHERE ps.scheduledDate BETWEEN :startDate AND :endDate ORDER BY ps.scheduledDate ASC, ps.startTime ASC")
    List<ProductionSchedule> findSchedulesInDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT ps FROM ProductionSchedule ps WHERE ps.productionLine = :productionLine AND ps.scheduledDate = :scheduledDate AND " +
           "((ps.startTime < :endTime AND ps.endTime > :startTime))")
    List<ProductionSchedule> findOverlappingSchedules(@Param("productionLine") String productionLine,
                                                      @Param("scheduledDate") LocalDateTime scheduledDate,
                                                      @Param("startTime") LocalDateTime startTime,
                                                      @Param("endTime") LocalDateTime endTime);

    @Query("SELECT ps FROM ProductionSchedule ps WHERE ps.status IN :statuses AND ps.scheduledDate >= :fromDate ORDER BY ps.scheduledDate ASC, ps.startTime ASC")
    List<ProductionSchedule> findActiveSchedulesFromDate(@Param("statuses") List<ProductionSchedule.ScheduleStatus> statuses,
                                                         @Param("fromDate") LocalDateTime fromDate);

    boolean existsByScheduleNumber(String scheduleNumber);

    @Query("SELECT AVG(ps.capacityUtilization) FROM ProductionSchedule ps WHERE ps.status = :status AND ps.scheduledDate BETWEEN :startDate AND :endDate")
    Double getAverageCapacityUtilization(@Param("status") ProductionSchedule.ScheduleStatus status,
                                         @Param("startDate") LocalDateTime startDate,
                                         @Param("endDate") LocalDateTime endDate);
}
