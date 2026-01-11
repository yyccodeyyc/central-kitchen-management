package com.ckm.service;

import com.ckm.entity.ProductionSchedule;
import com.ckm.repository.ProductionScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProductionScheduleService {

    @Autowired
    private ProductionScheduleRepository productionScheduleRepository;

    public List<ProductionSchedule> findAll() {
        return productionScheduleRepository.findAll();
    }

    public Optional<ProductionSchedule> findById(Long id) {
        return productionScheduleRepository.findById(id);
    }

    public ProductionSchedule save(ProductionSchedule schedule) {
        // 生成排程编号
        if (schedule.getScheduleNumber() == null) {
            schedule.setScheduleNumber(generateScheduleNumber());
        }

        // 验证排程不冲突
        validateScheduleConflict(schedule);

        return productionScheduleRepository.save(schedule);
    }

    public void deleteById(Long id) {
        productionScheduleRepository.deleteById(id);
    }

    public List<ProductionSchedule> findByScheduledDate(LocalDateTime scheduledDate) {
        return productionScheduleRepository.findByScheduledDateOrderByStartTimeAsc(scheduledDate);
    }

    public List<ProductionSchedule> findByProductionLineAndDate(String productionLine, LocalDateTime scheduledDate) {
        return productionScheduleRepository.findByProductionLineAndScheduledDateOrderByStartTimeAsc(productionLine, scheduledDate);
    }

    public List<ProductionSchedule> findByStatus(ProductionSchedule.ScheduleStatus status) {
        return productionScheduleRepository.findByStatusOrderByScheduledDateAscStartTimeAsc(status);
    }

    public List<ProductionSchedule> findSchedulesInDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return productionScheduleRepository.findSchedulesInDateRange(startDate, endDate);
    }

    public List<ProductionSchedule> findActiveSchedulesFromDate(LocalDateTime fromDate) {
        return productionScheduleRepository.findActiveSchedulesFromDate(
                List.of(ProductionSchedule.ScheduleStatus.CONFIRMED, ProductionSchedule.ScheduleStatus.IN_PROGRESS),
                fromDate);
    }

    public ProductionSchedule confirmSchedule(Long scheduleId, String confirmedBy) {
        ProductionSchedule schedule = productionScheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("生产排程不存在"));

        schedule.setStatus(ProductionSchedule.ScheduleStatus.CONFIRMED);
        schedule.setUpdatedBy(confirmedBy);
        return productionScheduleRepository.save(schedule);
    }

    public ProductionSchedule startSchedule(Long scheduleId, String startedBy) {
        ProductionSchedule schedule = productionScheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("生产排程不存在"));

        schedule.setStatus(ProductionSchedule.ScheduleStatus.IN_PROGRESS);
        schedule.setUpdatedBy(startedBy);
        return productionScheduleRepository.save(schedule);
    }

    public ProductionSchedule completeSchedule(Long scheduleId, String completedBy) {
        ProductionSchedule schedule = productionScheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("生产排程不存在"));

        schedule.setStatus(ProductionSchedule.ScheduleStatus.COMPLETED);
        schedule.setUpdatedBy(completedBy);
        return productionScheduleRepository.save(schedule);
    }

    public boolean existsByScheduleNumber(String scheduleNumber) {
        return productionScheduleRepository.existsByScheduleNumber(scheduleNumber);
    }

    private String generateScheduleNumber() {
        LocalDateTime now = LocalDateTime.now();
        String dateStr = now.format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd"));
        String sequence = String.format("%04d", getNextSequenceNumber());
        return "PS" + dateStr + sequence;
    }

    private int getNextSequenceNumber() {
        LocalDateTime today = LocalDateTime.now().toLocalDate().atStartOfDay();
        LocalDateTime tomorrow = today.plusDays(1);

        long count = productionScheduleRepository.findSchedulesInDateRange(today, tomorrow).size();
        return (int) count + 1;
    }

    private void validateScheduleConflict(ProductionSchedule schedule) {
        List<ProductionSchedule> conflicts = productionScheduleRepository.findOverlappingSchedules(
                schedule.getProductionLine(),
                schedule.getScheduledDate(),
                schedule.getStartTime(),
                schedule.getEndTime());

        // 排除自己
        conflicts = conflicts.stream()
                .filter(s -> !s.getId().equals(schedule.getId()))
                .toList();

        if (!conflicts.isEmpty()) {
            throw new RuntimeException("生产排程时间冲突：生产线 " + schedule.getProductionLine() +
                    " 在 " + schedule.getScheduledDate() + " " +
                    schedule.getStartTime() + " - " + schedule.getEndTime() + " 已有排程");
        }
    }

    // 统计方法
    public Double getAverageCapacityUtilization(ProductionSchedule.ScheduleStatus status,
                                               LocalDateTime startDate, LocalDateTime endDate) {
        return productionScheduleRepository.getAverageCapacityUtilization(status, startDate, endDate);
    }
}
