package com.ckm;

import com.ckm.entity.*;
import com.ckm.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private ProductionStandardRepository productionStandardRepository;

    @Autowired
    private QualityTraceRepository qualityTraceRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private ProductionOrderRepository productionOrderRepository;

    @Autowired
    private ProductionScheduleRepository productionScheduleRepository;

    @Autowired
    private ProductionBatchRepository productionBatchRepository;

    @Autowired
    private ProductionStepRepository productionStepRepository;

    @Autowired
    private FranchiseRepository franchiseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        initializeUsers();
        initializeProductionStandards();
        initializeQualityTraces();
        initializeSuppliers();
        initializeFranchises();
        initializeProductionOrders();
        initializeProductionSchedules();
        initializeProductionBatches();

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

    private void initializeFranchises() {
        if (franchiseRepository.count() == 0) {
            Franchise[] franchises = {
                Franchise.builder()
                    .name("北京朝阳店")
                    .code("BJCY001")
                    .address("北京市朝阳区建国路88号")
                    .contactPerson("李经理")
                    .contactPhone("13800138007")
                    .status(Franchise.Status.ACTIVE)
                    .build(),

                Franchise.builder()
                    .name("上海浦东店")
                    .code("SHPD002")
                    .address("上海市浦东新区陆家嘴金融贸易区")
                    .contactPerson("王经理")
                    .contactPhone("13800138008")
                    .status(Franchise.Status.ACTIVE)
                    .build(),

                Franchise.builder()
                    .name("广州天河店")
                    .code("GZTH003")
                    .address("广州市天河区珠江新城")
                    .contactPerson("张经理")
                    .contactPhone("13800138009")
                    .status(Franchise.Status.ACTIVE)
                    .build()
            };

            for (Franchise franchise : franchises) {
                franchiseRepository.save(franchise);
            }
            System.out.println("✅ 加盟商数据初始化完成");
        }
    }

    private void initializeProductionOrders() {
        if (productionOrderRepository.count() == 0) {
            // 获取已初始化的数据
            ProductionStandard gongBaoJiDing = productionStandardRepository.findAll().stream()
                .filter(ps -> ps.getDishName().equals("宫保鸡丁"))
                .findFirst().orElse(null);

            ProductionStandard yuXiangRouSi = productionStandardRepository.findAll().stream()
                .filter(ps -> ps.getDishName().equals("鱼香肉丝"))
                .findFirst().orElse(null);

            Franchise beijingStore = franchiseRepository.findAll().stream()
                .filter(f -> f.getCode().equals("BJCY001"))
                .findFirst().orElse(null);

            Franchise shanghaiStore = franchiseRepository.findAll().stream()
                .filter(f -> f.getCode().equals("SHPD002"))
                .findFirst().orElse(null);

            if (gongBaoJiDing != null && yuXiangRouSi != null && beijingStore != null && shanghaiStore != null) {
                ProductionOrder[] orders = {
                    ProductionOrder.builder()
                        .orderNumber("PO20240101001")
                        .franchise(beijingStore)
                        .productionStandard(gongBaoJiDing)
                        .quantity(50)
                        .unitPrice(15.00)
                        .priority(ProductionOrder.Priority.NORMAL)
                        .status(ProductionOrder.OrderStatus.PENDING)
                        .orderDate(LocalDateTime.now().minusDays(1))
                        .requiredDate(LocalDateTime.now().plusDays(2))
                        .specialInstructions("需要额外包装")
                        .notes("北京朝阳店常规订单")
                        .createdBy("系统")
                        .updatedBy("系统")
                        .build(),

                    ProductionOrder.builder()
                        .orderNumber("PO20240101002")
                        .franchise(shanghaiStore)
                        .productionStandard(yuXiangRouSi)
                        .quantity(30)
                        .unitPrice(18.00)
                        .priority(ProductionOrder.Priority.HIGH)
                        .status(ProductionOrder.OrderStatus.APPROVED)
                        .orderDate(LocalDateTime.now().minusHours(12))
                        .requiredDate(LocalDateTime.now().plusDays(1))
                        .specialInstructions("VIP客户订单，优先处理")
                        .notes("上海浦东店紧急订单")
                        .createdBy("系统")
                        .updatedBy("系统")
                        .build()
                };

                for (ProductionOrder order : orders) {
                    productionOrderRepository.save(order);
                }
                System.out.println("✅ 生产订单数据初始化完成");
            }
        }
    }

    private void initializeProductionSchedules() {
        if (productionScheduleRepository.count() == 0) {
            LocalDateTime today = LocalDateTime.now().withHour(9).withMinute(0); // 今天早上9点

            ProductionSchedule[] schedules = {
                ProductionSchedule.builder()
                    .scheduleNumber("PS20240101001")
                    .scheduledDate(today)
                    .startTime(today)
                    .endTime(today.plusMinutes(90))
                    .productionLine("生产线A")
                    .equipment("多功能炒锅A1")
                    .assignedStaff("厨师长张三")
                    .status(ProductionSchedule.ScheduleStatus.PLANNED)
                    .capacityUtilization(75.0)
                    .notes("宫保鸡丁生产排程")
                    .createdBy("系统")
                    .updatedBy("系统")
                    .build(),

                ProductionSchedule.builder()
                    .scheduleNumber("PS20240101002")
                    .scheduledDate(today.plusHours(2))
                    .startTime(today.plusHours(2))
                    .endTime(today.plusHours(2).plusMinutes(60))
                    .productionLine("生产线B")
                    .equipment("多功能炒锅B2")
                    .assignedStaff("厨师李四")
                    .status(ProductionSchedule.ScheduleStatus.CONFIRMED)
                    .capacityUtilization(50.0)
                    .notes("鱼香肉丝生产排程")
                    .createdBy("系统")
                    .updatedBy("系统")
                    .build()
            };

            for (ProductionSchedule schedule : schedules) {
                productionScheduleRepository.save(schedule);
            }
            System.out.println("✅ 生产排程数据初始化完成");
        }
    }

    private void initializeProductionBatches() {
        if (productionBatchRepository.count() == 0) {
            // 获取已初始化的数据
            ProductionOrder order = productionOrderRepository.findAll().stream()
                .filter(o -> o.getOrderNumber().equals("PO20240101001"))
                .findFirst().orElse(null);

            ProductionSchedule schedule = productionScheduleRepository.findAll().stream()
                .filter(s -> s.getScheduleNumber().equals("PS20240101001"))
                .findFirst().orElse(null);

            if (order != null && schedule != null) {
                ProductionBatch batch = ProductionBatch.builder()
                    .batchNumber("PB20240101001")
                    .productionOrder(order)
                    .productionSchedule(schedule)
                    .plannedQuantity(50)
                    .startTime(LocalDateTime.now().minusHours(2))
                    .status(ProductionBatch.BatchStatus.IN_PROGRESS)
                    .materialCost(375.00) // 50 * 7.5
                    .laborCost(50.00)
                    .overheadCost(25.00)
                    .notes("宫保鸡丁第一批生产")
                    .createdBy("系统")
                    .updatedBy("系统")
                    .build();

                productionBatchRepository.save(batch);

                // 初始化生产步骤
                initializeProductionSteps(batch);

                System.out.println("✅ 生产批次数据初始化完成");
            }
        }
    }

    private void initializeProductionSteps(ProductionBatch batch) {
        if (productionStepRepository.count() == 0) {
            ProductionStep[] steps = {
                ProductionStep.builder()
                    .productionBatch(batch)
                    .stepNumber(1)
                    .stepName("食材准备")
                    .instructions("称量鸡胸肉300g，花生米50g，青椒100g，胡萝卜50g，准备葱姜蒜")
                    .plannedDurationMinutes(10)
                    .assignedStaff("配菜员小王")
                    .equipment("电子秤")
                    .qualityCheckpoints("食材新鲜度检查，重量准确性")
                    .status(ProductionStep.StepStatus.COMPLETED)
                    .qualityResult(ProductionStep.QualityResult.PASS)
                    .createdBy("系统")
                    .updatedBy("系统")
                    .build(),

                ProductionStep.builder()
                    .productionBatch(batch)
                    .stepNumber(2)
                    .stepName("切配加工")
                    .instructions("鸡胸肉切丁，青椒和胡萝卜切丝，花生米炒香")
                    .plannedDurationMinutes(8)
                    .assignedStaff("切配师小李")
                    .equipment("切菜板，菜刀")
                    .qualityCheckpoints("刀工标准，食材形状均匀")
                    .status(ProductionStep.StepStatus.IN_PROGRESS)
                    .qualityResult(ProductionStep.QualityResult.PENDING)
                    .createdBy("系统")
                    .updatedBy("系统")
                    .build(),

                ProductionStep.builder()
                    .productionBatch(batch)
                    .stepNumber(3)
                    .stepName("烹饪制作")
                    .instructions("热锅下油，加入葱姜蒜爆香，放入鸡丁翻炒，再加入配菜和花生米")
                    .plannedDurationMinutes(15)
                    .assignedStaff("厨师张三")
                    .equipment("多功能炒锅A1")
                    .qualityCheckpoints("火候控制，色泽鲜亮，口感鲜嫩")
                    .status(ProductionStep.StepStatus.PENDING)
                    .qualityResult(ProductionStep.QualityResult.PENDING)
                    .createdBy("系统")
                    .updatedBy("系统")
                    .build()
            };

            for (ProductionStep step : steps) {
                productionStepRepository.save(step);
            }
            System.out.println("✅ 生产步骤数据初始化完成");
        }
    }

    private void initializeUsers() {
        if (userRepository.count() == 0) {
            User[] users = {
                new User("admin", passwordEncoder.encode("admin123"), "admin@ckm.com", User.UserRole.ADMIN),
                new User("manager", passwordEncoder.encode("manager123"), "manager@ckm.com", User.UserRole.MANAGER),
                new User("staff", passwordEncoder.encode("staff123"), "staff@ckm.com", User.UserRole.STAFF)
            };

            for (User user : users) {
                userRepository.save(user);
            }
            System.out.println("✅ 用户数据初始化完成");
            System.out.println("🔐 默认用户:");
            System.out.println("   管理员: admin / admin123");
            System.out.println("   经理: manager / manager123");
            System.out.println("   员工: staff / staff123");
        }
    }
}
