package com.ufpr.byteassist_backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.surrealdb.RecordId;
import com.ufpr.byteassist_backend.exception.EnhancedStatusException;
import com.ufpr.byteassist_backend.model.Budget;
import com.ufpr.byteassist_backend.model.Task;
import com.ufpr.byteassist_backend.repository.BudgetRepoInterface;
import com.ufpr.byteassist_backend.repository.TaskRepoInterface;

@Service
public class BudgetService {
    private final BudgetRepoInterface budgetRepo;
    private final TaskRepoInterface taskRepo;

    public BudgetService(BudgetRepoInterface budgetRepo, TaskRepoInterface taskRepo) {
        this.budgetRepo = budgetRepo;
        this.taskRepo = taskRepo;
    }
    
    public ResponseEntity<List<Budget>> getAllBudgets() {
        Optional<List<Budget>> budgets = budgetRepo.getAllBudgets();
        if (budgets.isEmpty()) {
            throw new EnhancedStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Error retrieving all budgets from database",
                "There was a problem accessing the database to retrieve the list of budgets"
            );
        }
        return ResponseEntity.ok(budgets.get());
    }
    
    public ResponseEntity<Budget> getBudgetById(String id) {
        Optional<Budget> budget = budgetRepo.getBudgetById(id);
        if (budget.isEmpty()) {
            throw new EnhancedStatusException(
                HttpStatus.NOT_FOUND,
                "Budget not found",
                "No budget found with the provided ID"
            );
        }
        return ResponseEntity.ok(budget.get());
    }
    
    public ResponseEntity<Budget> createBudget(Budget budget, String taskID) {
        Optional<Budget> createdBudget = budgetRepo.createBudget(budget);
        if (createdBudget.isEmpty()) {
            throw new EnhancedStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Error creating budget",
                "There was a problem accessing the database to create the budget"
            );
        }       
        
        RecordId newBudgetId = createdBudget.get().getId();

        Optional<Task> task = taskRepo.getTaskById(taskID);
        if (task.isEmpty()) {
            throw new EnhancedStatusException(
                HttpStatus.NOT_FOUND,
                "Task not found",
                "No task found with the provided ID"
            );
        }

        // agora atualizar a task e settar o budget com o novo ID
        Task updatedTask = task.get();
        updatedTask.setBudget(newBudgetId);
        
        Optional<Task> updatedTaskOpt = taskRepo.updateTask(updatedTask, taskID);
        if (updatedTaskOpt.isEmpty()) {
            throw new EnhancedStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Error updating task with budget",
                "There was a problem accessing the database to update the task with the new budget"
            );
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(createdBudget.get());
    }
    
    public ResponseEntity<Budget> updateBudget(String id, Budget budget) {
        Budget updatedBudget = budgetRepo.updateBudget(budget, id).orElseThrow(
            () -> new EnhancedStatusException(
                HttpStatus.NOT_FOUND,
                "Budget not found",
                "No budget found with the provided ID"
            ));
        return ResponseEntity.ok(updatedBudget);
    }
    
    public ResponseEntity<Void> deleteBudget(String id) {
        boolean deleted = budgetRepo.deleteBudget(id);
        if (!deleted) {
            throw new EnhancedStatusException(
                HttpStatus.NOT_FOUND,
                "Budget not found",
                "No budget found with the provided ID"
            );
        }
        return ResponseEntity.noContent().build();
    }
    
    public ResponseEntity<List<Budget>> getBudgetsByEquipment(String equipmentId) {
        Optional<List<Budget>> budgets = budgetRepo.getBudgetsByEquipment(equipmentId);
        if (budgets.isEmpty()) {
            throw new EnhancedStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Error retrieving budgets by equipment from database",
                "There was a problem accessing the database to retrieve the list of budgets"
            );
        }
        return ResponseEntity.ok(budgets.get());
    }
}
