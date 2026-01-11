package com.ckm;

import com.ckm.entity.ProductionStandard;
import com.ckm.entity.QualityTrace;
import com.ckm.entity.Supplier;
import com.ckm.repository.ProductionStandardRepository;
import com.ckm.repository.QualityTraceRepository;
import com.ckm.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private ProductionStandardRepository productionStandardRepository;

    @Autowired
    private QualityTraceRepository qualityTraceRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Override
    public void run(String... args) throws Exception {
        initializeProductionStandards();
        initializeQualityTraces();
        initializeSuppliers();

        System.out.println("🎉 数据初始化完成！");
    }

    private void initializeProductionStandards() {
        if (productionStandardRepository.count() == 0) {
            ProductionStandard[] standards = {
                ProductionStandard.builder()
                    .dishName("宫保鸡丁")
                    .recipe("鸡胸肉300g，花生米50g，青椒100g，胡萝卜50g，葱姜蒜适量")
                    .standardWeight(450.0)
                    .cookingTime(15)
                    .qualityStandards("色泽红亮，鸡丁鲜嫩，花生酥脆，口感麻辣鲜香")
                    .status(ProductionStandard.Status.ACTIVE)
                    .build(),

                ProductionStandard.builder()
                    .dishName("鱼香肉丝")
                    .recipe("猪里脊肉300g，冬笋100g，水发木耳50g，胡萝卜50g，泡椒适量")
                    .standardWeight(500.0)
                    .cookingTime(12)
                    .qualityStandards("色泽红亮，肉丝鲜嫩，酸甜适口，鱼香味浓")
                    .status(ProductionStandard.Status.ACTIVE)
                    .build(),

                ProductionStandard.builder()
                    .dishName("糖醋里脊")
                    .recipe("猪里脊肉400g，鸡蛋2个，面粉适量，番茄酱、白糖、醋适量")
                    .standardWeight(480.0)
                    .cookingTime(18)
                    .qualityStandards("色泽金黄，外酥里嫩，酸甜适口，造型美观")
                    .status(ProductionStandard.Status.ACTIVE)
                    .build(),

                ProductionStandard.builder()
                    .dishName("麻婆豆腐")
                    .recipe("嫩豆腐400g，牛肉末150g，豆瓣酱、郫县豆瓣、花椒粉适量")
                    .standardWeight(550.0)
                    .cookingTime(10)
                    .qualityStandards("色泽红亮，麻辣鲜香，豆腐嫩滑，汁芡浓郁")
                    .status(ProductionStandard.Status.ACTIVE)
                    .build(),

                ProductionStandard.builder()
                    .dishName("回锅肉")
                    .recipe("五花肉300g，青椒150g，蒜苗100g，豆瓣酱、甜面酱适量")
                    .standardWeight(550.0)
                    .cookingTime(14)
                    .qualityStandards("色泽红亮，肥而不腻，香辣适口，蔬菜脆嫩")
                    .status(ProductionStandard.Status.ACTIVE)
                    .build()
            };

            for (ProductionStandard standard : standards) {
                productionStandardRepository.save(standard);
            }
            System.out.println("✅ 生产标准化数据初始化完成");
        }
    }

    private void initializeQualityTraces() {
        if (qualityTraceRepository.count() == 0) {
            QualityTrace[] traces = {
                QualityTrace.builder()
                    .batchNumber("JT20240101001")
                    .ingredientId("CHICKEN001")
                    .ingredientName("鸡胸肉")
                    .productionDate(LocalDate.now().minusDays(2))
                    .expiryDate(LocalDate.now().plusDays(5))
                    .supplierInfo("河南五星食品有限公司")
                    .qualityCheck("PASSED")
                    .status(QualityTrace.QualityStatus.PASSED)
                    .inspector("李检查")
                    .build(),

                QualityTrace.builder()
                    .batchNumber("JT20240101002")
                    .ingredientId("PORK001")
                    .ingredientName("五花肉")
                    .productionDate(LocalDate.now().minusDays(1))
                    .expiryDate(LocalDate.now().plusDays(7))
                    .supplierInfo("山东鲁肉食品集团")
                    .qualityCheck("PASSED")
                    .status(QualityTrace.QualityStatus.PASSED)
                    .inspector("王检查")
                    .build(),

                QualityTrace.builder()
                    .batchNumber("JT20240101003")
                    .ingredientId("VEG001")
                    .ingredientName("青椒")
                    .productionDate(LocalDate.now())
                    .expiryDate(LocalDate.now().plusDays(10))
                    .supplierInfo("北京新发地农产品市场")
                    .qualityCheck("PENDING")
                    .status(QualityTrace.QualityStatus.PENDING)
                    .build(),

                QualityTrace.builder()
                    .batchNumber("JT20240101004")
                    .ingredientId("TOFU001")
                    .ingredientName("嫩豆腐")
                    .productionDate(LocalDate.now().minusDays(3))
                    .expiryDate(LocalDate.now().plusDays(3))
                    .supplierInfo("内蒙古伊利乳业")
                    .qualityCheck("PASSED")
                    .status(QualityTrace.QualityStatus.PASSED)
                    .inspector("张检查")
                    .build(),

                QualityTrace.builder()
                    .batchNumber("JT20240101005")
                    .ingredientId("CARROT001")
                    .ingredientName("胡萝卜")
                    .productionDate(LocalDate.now().minusDays(1))
                    .expiryDate(LocalDate.now().plusDays(12))
                    .supplierInfo("甘肃天水蔬菜基地")
                    .qualityCheck("PASSED")
                    .status(QualityTrace.QualityStatus.PASSED)
                    .inspector("刘检查")
                    .build()
            };

            for (QualityTrace trace : traces) {
                qualityTraceRepository.save(trace);
            }
            System.out.println("✅ 质量追溯数据初始化完成");
        }
    }

    private void initializeSuppliers() {
        if (supplierRepository.count() == 0) {
            Supplier[] suppliers = {
                Supplier.builder()
                    .name("河南五星食品有限公司")
                    .category("肉类制品")
                    .qualityGrade("A级")
                    .contractPrice(25.5)
                    .deliveryCycle(2)
                    .contactPerson("张经理")
                    .contactPhone("13800138001")
                    .address("河南省郑州市食品工业园区")
                    .certificates("HACCP认证,ISO22000认证")
                    .status(Supplier.SupplierStatus.ACTIVE)
                    .rating(4.8)
                    .lastDeliveryDate(LocalDate.now().minusDays(1))
                    .build(),

                Supplier.builder()
                    .name("山东鲁肉食品集团")
                    .category("肉类制品")
                    .qualityGrade("A级")
                    .contractPrice(28.0)
                    .deliveryCycle(3)
                    .contactPerson("李总监")
                    .contactPhone("13800138002")
                    .address("山东省济南市食品加工基地")
                    .certificates("QS认证,绿色食品认证")
                    .status(Supplier.SupplierStatus.ACTIVE)
                    .rating(4.6)
                    .lastDeliveryDate(LocalDate.now().minusDays(2))
                    .build(),

                Supplier.builder()
                    .name("北京新发地农产品市场")
                    .category("蔬菜水果")
                    .qualityGrade("B级")
                    .contractPrice(8.5)
                    .deliveryCycle(1)
                    .contactPerson("王经理")
                    .contactPhone("13800138003")
                    .address("北京市丰台区新发地农产品批发市场")
                    .certificates("农产品质量安全认证")
                    .status(Supplier.SupplierStatus.ACTIVE)
                    .rating(4.2)
                    .lastDeliveryDate(LocalDate.now())
                    .build(),

                Supplier.builder()
                    .name("内蒙古伊利乳业")
                    .category("乳制品")
                    .qualityGrade("A级")
                    .contractPrice(15.0)
                    .deliveryCycle(2)
                    .contactPerson("赵总")
                    .contactPhone("13800138004")
                    .address("内蒙古呼和浩特市乳业园区")
                    .certificates("GMP认证,ISO9001认证")
                    .status(Supplier.SupplierStatus.ACTIVE)
                    .rating(4.9)
                    .lastDeliveryDate(LocalDate.now().minusDays(1))
                    .build(),

                Supplier.builder()
                    .name("甘肃天水蔬菜基地")
                    .category("蔬菜水果")
                    .qualityGrade("A级")
                    .contractPrice(6.8)
                    .deliveryCycle(1)
                    .contactPerson("孙经理")
                    .contactPhone("13800138005")
                    .address("甘肃省天水市蔬菜种植基地")
                    .certificates("绿色食品认证,无公害农产品认证")
                    .status(Supplier.SupplierStatus.ACTIVE)
                    .rating(4.5)
                    .lastDeliveryDate(LocalDate.now().minusDays(1))
                    .build(),

                Supplier.builder()
                    .name("四川郫县豆瓣集团")
                    .category("调味品")
                    .qualityGrade("A级")
                    .contractPrice(12.0)
                    .deliveryCycle(5)
                    .contactPerson("周厂长")
                    .contactPhone("13800138006")
                    .address("四川省成都市郫县豆瓣产业园")
                    .certificates("地理标志产品认证,国家级非物质文化遗产")
                    .status(Supplier.SupplierStatus.ACTIVE)
                    .rating(4.7)
                    .lastDeliveryDate(LocalDate.now().minusDays(3))
                    .build()
            };

            for (Supplier supplier : suppliers) {
                supplierRepository.save(supplier);
            }
            System.out.println("✅ 供应商数据初始化完成");
        }
    }
}
