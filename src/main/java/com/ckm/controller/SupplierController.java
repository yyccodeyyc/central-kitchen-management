package com.ckm.controller;

import com.ckm.entity.Supplier;
import com.ckm.service.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin(origins = "*")
public class SupplierController {

    @Autowired
    private SupplierService supplierService;

    @GetMapping
    public ResponseEntity<List<Supplier>> getAllSuppliers() {
        List<Supplier> suppliers = supplierService.findAll();
        return ResponseEntity.ok(suppliers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Supplier> getSupplierById(@PathVariable Long id) {
        Optional<Supplier> supplier = supplierService.findById(id);
        return supplier.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Supplier>> getSuppliersByCategory(@PathVariable String category) {
        List<Supplier> suppliers = supplierService.findByCategory(category);
        return ResponseEntity.ok(suppliers);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Supplier>> getSuppliersByStatus(@PathVariable String status) {
        try {
            Supplier.SupplierStatus supplierStatus = Supplier.SupplierStatus.valueOf(status.toUpperCase());
            List<Supplier> suppliers = supplierService.findByStatus(supplierStatus);
            return ResponseEntity.ok(suppliers);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/grade/{grade}")
    public ResponseEntity<List<Supplier>> getSuppliersByGrade(@PathVariable String grade) {
        List<Supplier> suppliers = supplierService.findByQualityGrade(grade);
        return ResponseEntity.ok(suppliers);
    }

    @PostMapping
    public ResponseEntity<Supplier> createSupplier(@RequestBody Supplier supplier) {
        Supplier savedSupplier = supplierService.save(supplier);
        return ResponseEntity.ok(savedSupplier);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Supplier> updateSupplier(@PathVariable Long id, @RequestBody Supplier supplier) {
        Optional<Supplier> existingSupplier = supplierService.findById(id);
        if (existingSupplier.isPresent()) {
            supplier.setId(id);
            Supplier updatedSupplier = supplierService.save(supplier);
            return ResponseEntity.ok(updatedSupplier);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSupplier(@PathVariable Long id) {
        if (supplierService.findById(id).isPresent()) {
            supplierService.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/top-rated")
    public ResponseEntity<List<Supplier>> getTopRatedSuppliers(@RequestParam(defaultValue = "10") int limit) {
        List<Supplier> suppliers = supplierService.findTopRatedSuppliers(limit);
        return ResponseEntity.ok(suppliers);
    }

    @GetMapping("/active")
    public ResponseEntity<List<Supplier>> getActiveSuppliers() {
        List<Supplier> suppliers = supplierService.findActiveSuppliers();
        return ResponseEntity.ok(suppliers);
    }

    @GetMapping("/recent-delivery")
    public ResponseEntity<List<Supplier>> getSuppliersByRecentDelivery(@RequestParam(defaultValue = "30") int days) {
        List<Supplier> suppliers = supplierService.findSuppliersWithRecentDeliveries(days);
        return ResponseEntity.ok(suppliers);
    }

    @PostMapping("/{id}/rate")
    public ResponseEntity<Supplier> updateSupplierRating(@PathVariable Long id, @RequestParam double rating) {
        Optional<Supplier> supplier = supplierService.findById(id);
        if (supplier.isPresent()) {
            Supplier updatedSupplier = supplierService.updateRating(id, rating);
            return ResponseEntity.ok(updatedSupplier);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/status")
    public ResponseEntity<Supplier> updateSupplierStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            Supplier.SupplierStatus supplierStatus = Supplier.SupplierStatus.valueOf(status.toUpperCase());
            Optional<Supplier> supplier = supplierService.findById(id);
            if (supplier.isPresent()) {
                Supplier updatedSupplier = supplierService.updateStatus(id, supplierStatus);
                return ResponseEntity.ok(updatedSupplier);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/performance-report")
    public ResponseEntity<List<Supplier>> getSupplierPerformanceReport() {
        List<Supplier> suppliers = supplierService.generatePerformanceReport();
        return ResponseEntity.ok(suppliers);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Supplier>> searchSuppliers(@RequestParam String keyword) {
        List<Supplier> suppliers = supplierService.searchByNameOrContact(keyword);
        return ResponseEntity.ok(suppliers);
    }
}
