package com.ckm;

import com.ckm.entity.QualityTrace;
import com.ckm.entity.Supplier;
import com.ckm.repository.QualityTraceRepository;
import com.ckm.repository.SupplierRepository;
import com.ckm.service.AnalyticsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class AnalyticsServiceTest {

    @Mock
    private QualityTraceRepository qualityTraceRepository;

    @Mock
    private SupplierRepository supplierRepository;

    @InjectMocks
    private AnalyticsService analyticsService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetCostAnalysis() {
        // 准备测试数据
        Supplier supplier1 = new Supplier("测试供应商1", "蔬菜", "A级", 10.0, 2);
        Supplier supplier2 = new Supplier("测试供应商2", "肉类", "A级", 20.0, 3);
        List<Supplier> suppliers = Arrays.asList(supplier1, supplier2);

        when(supplierRepository.findAll()).thenReturn(suppliers);

        // 执行测试
        Map<String, Object> result = analyticsService.getCostAnalysis();

        // 验证结果
        assertNotNull(result);
        assertTrue(result.containsKey("totalCost"));
        assertTrue(result.containsKey("costByCategory"));
        assertTrue(result.containsKey("costTrend"));
        assertTrue(result.containsKey("costMetrics"));

        // 验证总成本计算
        double totalCost = (Double) result.get("totalCost");
        assertEquals(30.0, totalCost);

        // 验证分类成本
        @SuppressWarnings("unchecked")
        Map<String, Double> costByCategory = (Map<String, Double>) result.get("costByCategory");
        assertEquals(10.0, costByCategory.get("蔬菜"));
        assertEquals(20.0, costByCategory.get("肉类"));
    }

    @Test
    void testGetQualityMetrics() {
        // 准备测试数据
        QualityTrace passedTrace = new QualityTrace();
        passedTrace.setStatus(QualityTrace.QualityStatus.PASSED);

        QualityTrace failedTrace = new QualityTrace();
        failedTrace.setStatus(QualityTrace.QualityStatus.FAILED);

        List<QualityTrace> traces = Arrays.asList(passedTrace, failedTrace);

        when(qualityTraceRepository.findAll()).thenReturn(traces);

        // 执行测试
        Map<String, Object> result = analyticsService.getQualityMetrics();

        // 验证结果
        assertNotNull(result);
        assertTrue(result.containsKey("passRate"));

        // 验证合格率计算 (1/2 = 50%)
        double passRate = (Double) result.get("passRate");
        assertEquals(50.0, passRate);
    }

    @Test
    void testGetProductionEfficiency() {
        // 准备测试数据
        QualityTrace trace1 = new QualityTrace();
        trace1.setStatus(QualityTrace.QualityStatus.PASSED);

        QualityTrace trace2 = new QualityTrace();
        trace2.setStatus(QualityTrace.QualityStatus.IN_PROGRESS);

        List<QualityTrace> traces = Arrays.asList(trace1, trace2);

        when(qualityTraceRepository.findAll()).thenReturn(traces);

        // 执行测试
        Map<String, Object> result = analyticsService.getProductionEfficiency();

        // 验证结果
        assertNotNull(result);
        assertTrue(result.containsKey("productionStatusStats"));
        assertTrue(result.containsKey("productionCycle"));
        assertTrue(result.containsKey("capacityUtilization"));

        // 验证状态统计
        @SuppressWarnings("unchecked")
        Map<String, Long> statusStats = (Map<String, Long>) result.get("productionStatusStats");
        assertEquals(1L, statusStats.get("PASSED"));
        assertEquals(1L, statusStats.get("IN_PROGRESS"));
    }
}
