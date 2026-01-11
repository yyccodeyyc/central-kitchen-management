package com.ckm.controller;

import com.ckm.entity.User;
import com.ckm.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/admin/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public String listUsers(Model model) {
        model.addAttribute("users", userService.findAllUsers());
        return "admin/users";
    }

    @GetMapping("/new")
    public String newUserForm(Model model) {
        model.addAttribute("user", new User());
        model.addAttribute("roles", User.UserRole.values());
        return "admin/user-form";
    }

    @PostMapping
    public String saveUser(@ModelAttribute User user, RedirectAttributes redirectAttributes) {
        try {
            if (user.getId() == null) {
                // 新用户
                if (userService.existsByUsername(user.getUsername())) {
                    redirectAttributes.addFlashAttribute("error", "用户名已存在");
                    return "redirect:/admin/users/new";
                }
                if (userService.existsByEmail(user.getEmail())) {
                    redirectAttributes.addFlashAttribute("error", "邮箱已存在");
                    return "redirect:/admin/users/new";
                }
                userService.createUser(user.getUsername(), user.getPassword(),
                    user.getEmail(), user.getFullName(), user.getRole());
                redirectAttributes.addFlashAttribute("success", "用户创建成功");
            } else {
                // 更新用户
                User existingUser = userService.findById(user.getId()).orElse(null);
                if (existingUser != null) {
                    existingUser.setFullName(user.getFullName());
                    existingUser.setEmail(user.getEmail());
                    existingUser.setRole(user.getRole());
                    existingUser.setActive(user.getActive());
                    userService.saveUser(existingUser);
                    redirectAttributes.addFlashAttribute("success", "用户更新成功");
                }
            }
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "操作失败: " + e.getMessage());
        }
        return "redirect:/admin/users";
    }

    @GetMapping("/{id}/edit")
    public String editUserForm(@PathVariable Long id, Model model) {
        User user = userService.findById(id).orElse(null);
        if (user != null) {
            model.addAttribute("user", user);
            model.addAttribute("roles", User.UserRole.values());
            return "admin/user-form";
        }
        return "redirect:/admin/users";
    }

    @PostMapping("/{id}/delete")
    public String deleteUser(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        try {
            userService.deleteUser(id);
            redirectAttributes.addFlashAttribute("success", "用户删除成功");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "删除失败: " + e.getMessage());
        }
        return "redirect:/admin/users";
    }
}
