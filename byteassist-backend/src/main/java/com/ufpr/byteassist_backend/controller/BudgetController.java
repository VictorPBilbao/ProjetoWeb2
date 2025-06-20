package com.ufpr.byteassist_backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ufpr.byteassist_backend.model.Budget;
import com.ufpr.byteassist_backend.service.BudgetService;
import com.ufpr.byteassist_backend.validation.ValidationGroups;

@RestController
@RequestMapping("/api/budget")
public class BudgetController {
    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @GetMapping()
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<List<Budget>> getAllBudgets() {
        return budgetService.getAllBudgets();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<Budget> getBudgetById(@PathVariable String id) {
        return budgetService.getBudgetById(id);
    }
    
    @GetMapping("/byEquipment")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<List<Budget>> getBudgetsByEquipment(@RequestParam String equipmentId) {
        return budgetService.getBudgetsByEquipment(equipmentId);
    }

    @PostMapping("/{taskID}")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<Budget> createBudget(@Validated(ValidationGroups.Create.class) @RequestBody Budget budget, @PathVariable String taskID) {
        System.out.println("Creating budget for task ID: " + taskID);
        return budgetService.createBudget(budget, taskID);
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<Budget> updateBudget(@PathVariable String id, @Validated(ValidationGroups.Update.class) @RequestBody Budget budget) {
        return budgetService.updateBudget(id, budget);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Void> deleteBudget(@PathVariable String id) {
        return budgetService.deleteBudget(id);
    }
}
