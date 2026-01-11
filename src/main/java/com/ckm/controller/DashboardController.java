package com.ckm.controller;

import com.ckm.service.FranchiseService;
import com.ckm.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class DashboardController {

    @Autowired
    private UserService userService;

    @Autowired
    private FranchiseService franchiseService;

    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        // 添加统计数据到模型
        model.addAttribute("totalUsers", userService.getTotalUsers());
        model.addAttribute("totalFranchises", franchiseService.getTotalFranchises());
        model.addAttribute("activeFranchises", franchiseService.getActiveFranchiseCount());
        model.addAttribute("adminUsers", userService.findByRole(com.ckm.entity.User.UserRole.ADMIN).size());
        model.addAttribute("franchiseUsers", 0); // 暂时设为0
        model.addAttribute("managerUsers", userService.findByRole(com.ckm.entity.User.UserRole.MANAGER).size());
        model.addAttribute("kitchenUsers", 0); // 暂时设为0

        return "dashboard";
    }
}
