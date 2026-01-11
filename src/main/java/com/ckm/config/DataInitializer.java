package com.ckm.config;

import com.ckm.entity.User;
import com.ckm.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserService userService;

    @Override
    public void run(String... args) throws Exception {
        // 创建默认管理员用户
        if (!userService.existsByUsername("admin")) {
            userService.createUser("admin", "admin123", "admin@ckm.com", "系统管理员", User.UserRole.ADMIN);
            System.out.println("✅ 默认管理员用户已创建: admin / admin123");
        }

        // 创建示例加盟商用户
        if (!userService.existsByUsername("franchise1")) {
            userService.createUser("franchise1", "franchise123", "franchise1@ckm.com", "加盟商用户1", User.UserRole.FRANCHISEE);
            System.out.println("✅ 示例加盟商用户已创建: franchise1 / franchise123");
        }

        // 创建示例店长用户
        if (!userService.existsByUsername("manager1")) {
            userService.createUser("manager1", "manager123", "manager1@ckm.com", "门店经理1", User.UserRole.STORE_MANAGER);
            System.out.println("✅ 示例店长用户已创建: manager1 / manager123");
        }

        // 创建示例厨房管理员用户
        if (!userService.existsByUsername("kitchen1")) {
            userService.createUser("kitchen1", "kitchen123", "kitchen1@ckm.com", "厨房管理员1", User.UserRole.KITCHEN_MANAGER);
            System.out.println("✅ 示例厨房管理员用户已创建: kitchen1 / kitchen123");
        }

        System.out.println("🎉 数据初始化完成！");
    }
}
