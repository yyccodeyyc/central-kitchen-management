package com.ckm.service;

import com.ckm.entity.Supplier;
import com.ckm.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class SupplierService {

    @Autowired
    private SupplierRepository supplierRepository;

    public List<Supplier> findAll() {
        return supplierRepository.findAll();
    }

    public Optional<Supplier> findById(Long id) {
        return supplierRepository.findById(id);
    }

    public List<Supplier> findByCategory(String category) {
        return supplierRepository.findByCategory(category);
    }

    public List<Supplier> findByStatus(Supplier.SupplierStatus status) {
        return supplierRepository.findByStatus(status);
    }

    public List<Supplier> findByQualityGrade(String grade) {
        return supplierRepository.findByQualityGrade(grade);
    }

    public Supplier save(Supplier supplier) {
        if (supplier.getId() == null) {
            supplier.setCreatedAt(LocalDate.now());
        }
        supplier.setUpdatedAt(LocalDate.now());
        return supplierRepository.save(supplier);
    }

    public void deleteById(Long id) {
        supplierRepository.deleteById(id);
    }

    public List<Supplier> findTopRatedSuppliers(int limit) {
        return supplierRepository.findTopByRatingOrderByRatingDesc(limit);
    }

    public List<Supplier> findActiveSuppliers() {
        return supplierRepository.findByStatus(Supplier.SupplierStatus.ACTIVE);
    }

    public List<Supplier> findSuppliersWithRecentDeliveries(int days) {
        LocalDate cutoffDate = LocalDate.now().minusDays(days);
        return supplierRepository.findByLastDeliveryDateAfter(cutoffDate);
    }

    public Supplier updateRating(Long id, double rating) {
        Optional<Supplier> supplierOpt = supplierRepository.findById(id);
        if (supplierOpt.isPresent()) {
            Supplier supplier = supplierOpt.get();
            supplier.setRating(rating);
            supplier.setUpdatedAt(LocalDate.now());
            return supplierRepository.save(supplier);
        }
        throw new RuntimeException("Supplier not found with id: " + id);
    }

    public Supplier updateStatus(Long id, Supplier.SupplierStatus status) {
        Optional<Supplier> supplierOpt = supplierRepository.findById(id);
        if (supplierOpt.isPresent()) {
            Supplier supplier = supplierOpt.get();
            supplier.setStatus(status);
            supplier.setUpdatedAt(LocalDate.now());
            return supplierRepository.save(supplier);
        }
        throw new RuntimeException("Supplier not found with id: " + id);
    }

    public List<Supplier> generatePerformanceReport() {
        // 这里可以实现更复杂的性能报告逻辑
        return supplierRepository.findAllByOrderByRatingDesc();
    }

    public List<Supplier> searchByNameOrContact(String keyword) {
        return supplierRepository.findByNameContainingOrContactPersonContaining(keyword, keyword);
    }

    public List<Supplier> findByContractPriceLessThan(double maxPrice) {
        return supplierRepository.findByContractPriceLessThan(maxPrice);
    }

    public List<Supplier> findByDeliveryCycleLessThan(int maxDays) {
        return supplierRepository.findByDeliveryCycleLessThan(maxDays);
    }

    public long countByStatus(Supplier.SupplierStatus status) {
        return supplierRepository.countByStatus(status);
    }

    public double getAverageRating() {
        List<Supplier> suppliers = supplierRepository.findAll();
        return suppliers.stream()
                .filter(s -> s.getRating() != null)
                .mapToDouble(Supplier::getRating)
                .average()
                .orElse(0.0);
    }

    public List<Supplier> findAllByOrderByRatingDesc() {
        return supplierRepository.findAllByOrderByRatingDesc();
    }
}
