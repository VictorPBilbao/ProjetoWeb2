package com.ufpr.byteassist_backend.repository;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Repository;

import com.surrealdb.RecordId;
import com.surrealdb.Response;
import com.surrealdb.Surreal;
import com.surrealdb.UpType;
import com.ufpr.byteassist_backend.model.Budget;
import com.ufpr.byteassist_backend.service.DatabaseService;

@Repository
public class BudgetRepo implements BudgetRepoInterface {
    private final Surreal db;
    
    public BudgetRepo(DatabaseService databaseService) {
        this.db = databaseService.getDatabase();
    }
    
    @Override
    public Optional<List<Budget>> getAllBudgets() {
        try {
            Iterator<Budget> budgets = db.select(Budget.class, "Budget");
            List<Budget> budgetList = new ArrayList<>();
            budgets.forEachRemaining(budgetList::add);
            return Optional.ofNullable(budgetList);
        } catch (Exception e) {
            return Optional.empty();
        }
    }
    
    @Override
    public Optional<Budget> getBudgetById(String id) {
        try {
            return db.select(Budget.class, new RecordId("Budget", id));
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving budget with ID: " + id + e, e);
        }
    }
    
    @Override
    public Optional<Budget> createBudget(Budget budget) {
        try {
            return Optional.ofNullable(db.create(Budget.class, 
                new RecordId("Budget", "BDG-" + UUID.randomUUID().toString().replace("-", "").substring(0, 5).toUpperCase()), 
                budget));
        } catch (Exception e) {
            return Optional.empty();
        }
    }
    
    @Override
    public Optional<Budget> updateBudget(Budget budget, String id) {
        try {
            return Optional.ofNullable(db.update(Budget.class, new RecordId("Budget", id), UpType.MERGE, budget));
        } catch (Exception e) {
            return Optional.empty();
        }
    }
    
    @Override
    public Boolean deleteBudget(String id) {
        try {
            db.delete(new RecordId("Budget", id));
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    
    @Override
    public Optional<List<Budget>> getBudgetsByEquipment(String equipmentId) {
        try {
            String query = "SELECT * FROM Budget WHERE equipment.id.id() = $equipmentId";
            Response response = db.queryBind(query, Map.of("equipmentId", equipmentId));
            
            List<Budget> budgets = new ArrayList<>();
            for (var budgetRecord : response.take(0).getArray()) {
                Budget budget = budgetRecord.get(Budget.class);
                budgets.add(budget);
            }
            return Optional.of(budgets);
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}
