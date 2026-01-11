package com.ckm.repository;

import com.ckm.entity.ProductionStandard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductionStandardRepository extends JpaRepository<ProductionStandard, Long> {

    /**
     * 根据菜品名称查找标准化配方
     */
    ProductionStandard findByDishName(String dishName);

    /**
     * 根据状态查找标准化配方
     */
    List<ProductionStandard> findByStatus(ProductionStandard.StandardStatus status);

    /**
     * 查找活跃的标准化配方
     */
    List<ProductionStandard> findByStatusOrderByDishName(ProductionStandard.StandardStatus status);

    /**
     * 根据设备要求搜索配方
     */
    @Query("SELECT p FROM ProductionStandard p WHERE p.equipmentRequired LIKE %:equipment%")
    List<ProductionStandard> findByEquipmentRequired(@Param("equipment") String equipment);

    /**
     * 统计各状态的配方数量
     */
    @Query("SELECT p.status, COUNT(p) FROM ProductionStandard p GROUP BY p.status")
    List<Object[]> countByStatus();
}
