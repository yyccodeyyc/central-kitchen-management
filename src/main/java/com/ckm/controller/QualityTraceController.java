package com.ckm.controller;

import com.ckm.entity.QualityTrace;
import com.ckm.service.QualityTraceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/quality-traces")
@CrossOrigin(origins = "*")
public class QualityTraceController {

    @Autowired
    private QualityTraceService qualityTraceService;

    @GetMapping
    public ResponseEntity<List<QualityTrace>> getAllQualityTraces() {
        List<QualityTrace> traces = qualityTraceService.findAll();
        return ResponseEntity.ok(traces);
    }

    @GetMapping("/{id}")
    public ResponseEntity<QualityTrace> getQualityTraceById(@PathVariable Long id) {
        Optional<QualityTrace> trace = qualityTraceService.findById(id);
        return trace.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/batch/{batchNumber}")
    public ResponseEntity<List<QualityTrace>> getQualityTracesByBatch(@PathVariable String batchNumber) {
        List<QualityTrace> traces = qualityTraceService.findByBatchNumber(batchNumber);
        return ResponseEntity.ok(traces);
    }

    @GetMapping("/supplier/{supplierInfo}")
    public ResponseEntity<List<QualityTrace>> getQualityTracesBySupplier(@PathVariable String supplierInfo) {
        List<QualityTrace> traces = qualityTraceService.findBySupplierInfo(supplierInfo);
        return ResponseEntity.ok(traces);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<QualityTrace>> getQualityTracesByStatus(@PathVariable String status) {
        try {
            QualityTrace.QualityStatus qualityStatus = QualityTrace.QualityStatus.valueOf(status.toUpperCase());
            List<QualityTrace> traces = qualityTraceService.findByStatus(qualityStatus);
            return ResponseEntity.ok(traces);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping
    public ResponseEntity<QualityTrace> createQualityTrace(@RequestBody QualityTrace qualityTrace) {
        QualityTrace savedTrace = qualityTraceService.save(qualityTrace);
        return ResponseEntity.ok(savedTrace);
    }

    @PutMapping("/{id}")
    public ResponseEntity<QualityTrace> updateQualityTrace(@PathVariable Long id, @RequestBody QualityTrace qualityTrace) {
        Optional<QualityTrace> existingTrace = qualityTraceService.findById(id);
        if (existingTrace.isPresent()) {
            qualityTrace.setId(id);
            QualityTrace updatedTrace = qualityTraceService.save(qualityTrace);
            return ResponseEntity.ok(updatedTrace);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQualityTrace(@PathVariable Long id) {
        if (qualityTraceService.findById(id).isPresent()) {
            qualityTraceService.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/expiring-soon")
    public ResponseEntity<List<QualityTrace>> getExpiringSoonTraces() {
        List<QualityTrace> traces = qualityTraceService.findExpiringSoon();
        return ResponseEntity.ok(traces);
    }

    @GetMapping("/expired")
    public ResponseEntity<List<QualityTrace>> getExpiredTraces() {
        List<QualityTrace> traces = qualityTraceService.findExpired();
        return ResponseEntity.ok(traces);
    }

    @PostMapping("/{id}/inspect")
    public ResponseEntity<QualityTrace> performInspection(@PathVariable Long id,
                                                          @RequestParam String inspector,
                                                          @RequestParam String result,
                                                          @RequestParam(required = false) String notes) {
        Optional<QualityTrace> trace = qualityTraceService.findById(id);
        if (trace.isPresent()) {
            QualityTrace updatedTrace = qualityTraceService.performInspection(id, inspector, result, notes);
            return ResponseEntity.ok(updatedTrace);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
