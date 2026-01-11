package com.ckm.service;

import com.ckm.entity.QualityTrace;
import com.ckm.repository.QualityTraceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class QualityTraceService {

    @Autowired
    private QualityTraceRepository qualityTraceRepository;

    public List<QualityTrace> findAll() {
        return qualityTraceRepository.findAll();
    }

    public Optional<QualityTrace> findById(Long id) {
        return qualityTraceRepository.findById(id);
    }

    public List<QualityTrace> findByBatchNumber(String batchNumber) {
        return qualityTraceRepository.findByBatchNumber(batchNumber);
    }

    public List<QualityTrace> findBySupplierInfo(String supplierInfo) {
        return qualityTraceRepository.findBySupplierInfo(supplierInfo);
    }

    public List<QualityTrace> findByStatus(QualityTrace.QualityStatus status) {
        return qualityTraceRepository.findByStatus(status);
    }

    public QualityTrace save(QualityTrace qualityTrace) {
        if (qualityTrace.getId() == null) {
            qualityTrace.setCreatedAt(LocalDate.now());
        }
        qualityTrace.setUpdatedAt(LocalDate.now());
        return qualityTraceRepository.save(qualityTrace);
    }

    public void deleteById(Long id) {
        qualityTraceRepository.deleteById(id);
    }

    public List<QualityTrace> findExpiringSoon() {
        LocalDate sevenDaysFromNow = LocalDate.now().plusDays(7);
        return qualityTraceRepository.findByExpiryDateBetween(LocalDate.now(), sevenDaysFromNow);
    }

    public List<QualityTrace> findExpired() {
        return qualityTraceRepository.findByExpiryDateBefore(LocalDate.now());
    }

    public QualityTrace performInspection(Long id, String inspector, String result, String notes) {
        Optional<QualityTrace> traceOpt = qualityTraceRepository.findById(id);
        if (traceOpt.isPresent()) {
            QualityTrace trace = traceOpt.get();
            trace.setInspector(inspector);
            trace.setQualityCheck(result);
            trace.setNotes(notes);

            // 根据检查结果更新状态
            if ("PASSED".equalsIgnoreCase(result)) {
                trace.setStatus(QualityTrace.QualityStatus.PASSED);
            } else if ("FAILED".equalsIgnoreCase(result)) {
                trace.setStatus(QualityTrace.QualityStatus.FAILED);
            } else {
                trace.setStatus(QualityTrace.QualityStatus.QUARANTINED);
            }

            trace.setUpdatedAt(LocalDate.now());
            return qualityTraceRepository.save(trace);
        }
        throw new RuntimeException("Quality trace not found with id: " + id);
    }

    public List<QualityTrace> findPendingInspections() {
        return qualityTraceRepository.findByStatus(QualityTrace.QualityStatus.PENDING);
    }

    public List<QualityTrace> findFailedInspections() {
        return qualityTraceRepository.findByStatus(QualityTrace.QualityStatus.FAILED);
    }

    public long countByStatus(QualityTrace.QualityStatus status) {
        return qualityTraceRepository.countByStatus(status);
    }

    public List<QualityTrace> findByProductionDateBetween(LocalDate startDate, LocalDate endDate) {
        return qualityTraceRepository.findByProductionDateBetween(startDate, endDate);
    }
}
