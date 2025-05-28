package com.ufpr.byteassist_backend.repository;

import java.util.List;
import java.util.Optional;

import com.ufpr.byteassist_backend.model.Budget;

public interface BudgetRepoInterface {
    Optional<List<Budget>> getAllBudgets();
    Optional<Budget> getBudgetById(String id);
    Optional<Budget> createBudget(Budget budget);
    Optional<Budget> updateBudget(Budget budget, String id);
    Boolean deleteBudget(String id);
    Optional<List<Budget>> getBudgetsByEquipment(String equipmentId);
}
