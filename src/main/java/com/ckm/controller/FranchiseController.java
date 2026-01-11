package com.ckm.controller;

import com.ckm.entity.Franchise;
import com.ckm.service.FranchiseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/franchises")
public class FranchiseController {

    @Autowired
    private FranchiseService franchiseService;

    @GetMapping
    public String listFranchises(Model model) {
        model.addAttribute("franchises", franchiseService.findAllFranchises());
        return "franchises/list";
    }

    @GetMapping("/new")
    public String newFranchiseForm(Model model) {
        model.addAttribute("franchise", new Franchise());
        model.addAttribute("statuses", Franchise.FranchiseStatus.values());
        return "franchises/form";
    }

    @PostMapping
    public String saveFranchise(@ModelAttribute Franchise franchise, RedirectAttributes redirectAttributes) {
        try {
            if (franchise.getId() == null) {
                franchiseService.createFranchise(franchise.getName(),
                    franchise.getContactPerson(), franchise.getContactPhone(), franchise.getAddress());
                redirectAttributes.addFlashAttribute("success", "加盟商创建成功");
            } else {
                Franchise existingFranchise = franchiseService.findById(franchise.getId()).orElse(null);
                if (existingFranchise != null) {
                    existingFranchise.setName(franchise.getName());
                    existingFranchise.setContactPerson(franchise.getContactPerson());
                    existingFranchise.setContactPhone(franchise.getContactPhone());
                    existingFranchise.setAddress(franchise.getAddress());
                    existingFranchise.setStatus(franchise.getStatus());
                    franchiseService.saveFranchise(existingFranchise);
                    redirectAttributes.addFlashAttribute("success", "加盟商更新成功");
                }
            }
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "操作失败: " + e.getMessage());
        }
        return "redirect:/franchises";
    }

    @GetMapping("/{id}/edit")
    public String editFranchiseForm(@PathVariable Long id, Model model) {
        Franchise franchise = franchiseService.findById(id).orElse(null);
        if (franchise != null) {
            model.addAttribute("franchise", franchise);
            model.addAttribute("statuses", Franchise.FranchiseStatus.values());
            return "franchises/form";
        }
        return "redirect:/franchises";
    }

    @PostMapping("/{id}/delete")
    public String deleteFranchise(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        try {
            franchiseService.deleteFranchise(id);
            redirectAttributes.addFlashAttribute("success", "加盟商删除成功");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "删除失败: " + e.getMessage());
        }
        return "redirect:/franchises";
    }

    @GetMapping("/active")
    public String listActiveFranchises(Model model) {
        model.addAttribute("franchises", franchiseService.findActiveFranchises());
        model.addAttribute("title", "活跃加盟商");
        return "franchises/list";
    }
}
