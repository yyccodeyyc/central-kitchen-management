package com.ckm.repository;

import com.ckm.entity.ProductionOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ProductionOrderRepository extends JpaRepository<ProductionOrder, Long> {

    List<ProductionOrder> findByFranchiseIdOrderByOrderDateDesc(Long franchiseId);

    List<ProductionOrder> findByStatusOrderByPriorityDescRequiredDateAsc(ProductionOrder.OrderStatus status);

    List<ProductionOrder> findByRequiredDateBetweenOrderByRequiredDateAsc(LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT po FROM ProductionOrder po WHERE po.status IN :statuses ORDER BY po.priority DESC, po.requiredDate ASC")
    List<ProductionOrder> findPendingAndScheduledOrders(@Param("statuses") List<ProductionOrder.OrderStatus> statuses);

    @Query("SELECT po FROM ProductionOrder po WHERE po.productionStandard.id = :standardId AND po.status = :status")
    List<ProductionOrder> findByProductionStandardAndStatus(@Param("standardId") Long standardId, @Param("status") ProductionOrder.OrderStatus status);

    @Query("SELECT COUNT(po) FROM ProductionOrder po WHERE po.status = :status AND po.requiredDate BETWEEN :startDate AND :endDate")
    long countByStatusAndDateRange(@Param("status") ProductionOrder.OrderStatus status,
                                   @Param("startDate") LocalDateTime startDate,
                                   @Param("endDate") LocalDateTime endDate);

    @Query("SELECT SUM(po.totalAmount) FROM ProductionOrder po WHERE po.status = :status AND po.orderDate BETWEEN :startDate AND :endDate")
    Double sumTotalAmountByStatusAndDateRange(@Param("status") ProductionOrder.OrderStatus status,
                                              @Param("startDate") LocalDateTime startDate,
                                              @Param("endDate") LocalDateTime endDate);

    boolean existsByOrderNumber(String orderNumber);
}
