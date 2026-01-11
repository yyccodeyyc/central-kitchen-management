package com.ckm.controller;

import com.ckm.entity.ProductionStandard;
import com.ckm.repository.ProductionStandardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

@RestController
@RequestMapping("/api/production-standards")
@CrossOrigin(origins = "*")
public class ProductionStandardController {

    @Autowired
    private ProductionStandardRepository productionStandardRepository;

    /**
     * 获取所有生产标准化配方
     */
    @GetMapping
    public ResponseEntity<List<ProductionStandard>> getAllProductionStandards() {
        List<ProductionStandard> standards = productionStandardRepository.findAll();
        return ResponseEntity.ok(standards);
    }

    /**
     * 根据ID获取生产标准化配方
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductionStandard> getProductionStandardById(@PathVariable Long id) {
        Optional<ProductionStandard> standard = productionStandardRepository.findById(id);
        return standard.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    /**
     * 根据菜品名称查找配方
     */
    @GetMapping("/dish/{dishName}")
    public ResponseEntity<ProductionStandard> getProductionStandardByDishName(@PathVariable String dishName) {
        ProductionStandard standard = productionStandardRepository.findByDishName(dishName);
        return standard != null ? ResponseEntity.ok(standard) : ResponseEntity.notFound().build();
    }

    /**
     * 获取活跃的生产标准化配方
     */
    @GetMapping("/active")
    public ResponseEntity<List<ProductionStandard>> getActiveProductionStandards() {
        List<ProductionStandard> standards = productionStandardRepository
            .findByStatusOrderByDishName(ProductionStandard.StandardStatus.ACTIVE);
        return ResponseEntity.ok(standards);
    }

    /**
     * 根据设备要求搜索配方
     */
    @GetMapping("/equipment/{equipment}")
    public ResponseEntity<List<ProductionStandard>> getProductionStandardsByEquipment(@PathVariable String equipment) {
        List<ProductionStandard> standards = productionStandardRepository.findByEquipmentRequired(equipment);
        return ResponseEntity.ok(standards);
    }

    /**
     * 创建新的生产标准化配方
     */
    @PostMapping
    public ResponseEntity<ProductionStandard> createProductionStandard(@RequestBody ProductionStandard standard) {
        ProductionStandard savedStandard = productionStandardRepository.save(standard);
        return ResponseEntity.ok(savedStandard);
    }

    /**
     * 更新生产标准化配方
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProductionStandard> updateProductionStandard(
            @PathVariable Long id, @RequestBody ProductionStandard standardDetails) {

        Optional<ProductionStandard> optionalStandard = productionStandardRepository.findById(id);
        if (optionalStandard.isPresent()) {
            ProductionStandard standard = optionalStandard.get();
            standard.setDishName(standardDetails.getDishName());
            standard.setRecipe(standardDetails.getRecipe());
            standard.setStandardWeight(standardDetails.getStandardWeight());
            standard.setCookingTime(standardDetails.getCookingTime());
            standard.setQualityStandards(standardDetails.getQualityStandards());
            standard.setPreparationSteps(standardDetails.getPreparationSteps());
            standard.setEquipmentRequired(standardDetails.getEquipmentRequired());
            standard.setStatus(standardDetails.getStatus());

            ProductionStandard updatedStandard = productionStandardRepository.save(standard);
            return ResponseEntity.ok(updatedStandard);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 删除生产标准化配方
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProductionStandard(@PathVariable Long id) {
        if (productionStandardRepository.existsById(id)) {
            productionStandardRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 获取生产标准化配方统计信息
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getProductionStandardStats() {
        Map<String, Object> stats = new HashMap<>();

        // 总配方数量
        long totalStandards = productionStandardRepository.count();

        // 各状态统计
        List<Object[]> statusStats = productionStandardRepository.countByStatus();
        Map<String, Long> statusCount = new HashMap<>();
        for (Object[] stat : statusStats) {
            statusCount.put(stat[0].toString(), (Long) stat[1]);
        }

        // 活跃配方数量
        long activeStandards = productionStandardRepository
            .findByStatus(ProductionStandard.StandardStatus.ACTIVE).size();

        stats.put("totalStandards", totalStandards);
        stats.put("activeStandards", activeStandards);
        stats.put("statusStats", statusCount);

        return ResponseEntity.ok(stats);
    }

    /**
     * 批量更新配方状态
     */
    @PutMapping("/batch/status")
    public ResponseEntity<String> batchUpdateStatus(
            @RequestBody Map<String, Object> request) {

        @SuppressWarnings("unchecked")
        List<Long> ids = (List<Long>) request.get("ids");
        String statusStr = (String) request.get("status");

        try {
            ProductionStandard.StandardStatus status = ProductionStandard.StandardStatus.valueOf(statusStr);

            for (Long id : ids) {
                Optional<ProductionStandard> optionalStandard = productionStandardRepository.findById(id);
                if (optionalStandard.isPresent()) {
                    ProductionStandard standard = optionalStandard.get();
                    standard.setStatus(status);
                    productionStandardRepository.save(standard);
                }
            }

            return ResponseEntity.ok("批量更新成功");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("无效的状态值");
        }
    }
}
