package com.ufpr.byteassist_backend.util;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.ufpr.byteassist_backend.model.Budget;
import com.ufpr.byteassist_backend.model.Equipment;
import com.ufpr.byteassist_backend.model.Task;
import com.ufpr.byteassist_backend.model.User;
import com.ufpr.byteassist_backend.service.BudgetService;
import com.ufpr.byteassist_backend.service.EquipmentService;
import com.ufpr.byteassist_backend.service.UserService;

/**
 * Utility class for handling task expansion in API responses.
 */
@Component
public class TaskExpander {
    private final UserService userService;
    private final EquipmentService equipmentService;
    private final BudgetService budgetService;
    
    public TaskExpander(UserService userService, 
                        EquipmentService equipmentService, 
                        BudgetService budgetService) {
        this.userService = userService;
        this.equipmentService = equipmentService;
        this.budgetService = budgetService;
    }
    
    /**
     * Expand a single Task with related entities based on the expand parameter
     */
    public Task expandTask(Task task, List<String> expand) {
        if (task == null || expand == null || expand.isEmpty()) {
            return task;
        }
        
        String cleanId;
        
        // Expand creator (User)
        if (expand.contains("creator") && task.getCreator() != null) {
            cleanId = task.getCreator().getId().toString().replaceAll("[⟨⟩]", "");
            User creator = userService.getUser(cleanId, null).getBody();
            if (creator != null) {
                task.setCreatorDetail(creator);
            }
        }
        
        // Expand assignee (User)
        if (expand.contains("assignee") && task.getAssignee() != null) {
            cleanId = task.getAssignee().getId().toString().replaceAll("[⟨⟩]", "");
            User assignee = userService.getUser(cleanId, null).getBody();
            if (assignee != null) {
                task.setAssigneeDetail(assignee);
            }
        }
        
        // Expand equipment (Equipment)
        if (expand.contains("equipment") && task.getEquipment() != null) {
            cleanId = task.getEquipment().getId().toString().replaceAll("[⟨⟩]", "");
            Equipment equipment = equipmentService.getEquipmentById(cleanId).getBody();
            if (equipment != null) {
                task.setEquipmentDetail(equipment);
            }
        }
        
        // Expand budget (Budget)
        if (expand.contains("budget") && task.getBudget() != null) {
            cleanId = task.getBudget().getId().toString().replaceAll("[⟨⟩]", "");
            Budget budget = budgetService.getBudgetById(cleanId).getBody();
            if (budget != null) {
                task.setBudgetDetail(budget);
            }
        }
        
        return task;
    }
    
    /**
     * Expand a list of Tasks with related entities based on the expand parameter
     * Uses batch retrieval for better performance
     */
    public List<Task> expandTasks(List<Task> tasks, List<String> expand) {
        if (tasks == null || tasks.isEmpty() || expand == null || expand.isEmpty()) {
            return tasks;
        }
        
        // Batch expand creator (User)
        if (expand.contains("creator")) {
            List<String> creatorIds = tasks.stream()
                .filter(task -> task.getCreator() != null)
                .map(task -> task.getCreator().getId().toString().replaceAll("[⟨⟩]", ""))
                .distinct()
                .toList();
                
            if (!creatorIds.isEmpty()) {
                List<User> creators = userService.getAllUsers(null).getBody();
                if (creators != null) {
                    Map<String, User> creatorMap = creators.stream()
                        .collect(Collectors.toMap(
                            user -> user.getUsername(),
                            Function.identity()
                        ));
                        
                    for (Task task : tasks) {
                        if (task.getCreator() != null) {
                            String creatorId = task.getCreator().getId().toString().replaceAll("[⟨⟩]", "");
                            User creator = creatorMap.get(creatorId);
                            if (creator != null) {
                                task.setCreatorDetail(creator);
                            }
                        }
                    }
                }
            }
        }
        
        // Batch expand assignee (User)
        if (expand.contains("assignee")) {
            List<String> assigneeIds = tasks.stream()
                .filter(task -> task.getAssignee() != null)
                .map(task -> task.getAssignee().getId().toString().replaceAll("[⟨⟩]", ""))
                .distinct()
                .toList();
                
            if (!assigneeIds.isEmpty()) {
                List<User> assignees = userService.getAllUsers(null).getBody();
                if (assignees != null) {
                    Map<String, User> assigneeMap = assignees.stream()
                        .collect(Collectors.toMap(
                            user -> user.getUsername(),
                            Function.identity()
                        ));
                        
                    for (Task task : tasks) {
                        if (task.getAssignee() != null) {
                            String assigneeId = task.getAssignee().getId().toString().replaceAll("[⟨⟩]", "");
                            User assignee = assigneeMap.get(assigneeId);
                            if (assignee != null) {
                                task.setAssigneeDetail(assignee);
                            }
                        }
                    }
                }
            }
        }
        
        // Batch expand equipment (Equipment)
        if (expand.contains("equipment")) {
            List<String> equipmentIds = tasks.stream()
                .filter(task -> task.getEquipment() != null)
                .map(task -> task.getEquipment().getId().toString().replaceAll("[⟨⟩]", ""))
                .distinct()
                .toList();
                
            if (!equipmentIds.isEmpty()) {
                List<Equipment> equipments = equipmentService.getAllEquipments().getBody();
                if (equipments != null) {
                    Map<String, Equipment> equipmentMap = equipments.stream()
                        .collect(Collectors.toMap(
                            equip -> equip.getId().getId().toString().replaceAll("[⟨⟩]", ""),
                            Function.identity()
                        ));
                        
                    for (Task task : tasks) {
                        if (task.getEquipment() != null) {
                            String equipmentId = task.getEquipment().getId().toString().replaceAll("[⟨⟩]", "");
                            Equipment equipment = equipmentMap.get(equipmentId);
                            if (equipment != null) {
                                task.setEquipmentDetail(equipment);
                            }
                        }
                    }
                }
            }
        }
        
        // Batch expand budget (Budget)
        if (expand.contains("budget")) {
            List<String> budgetIds = tasks.stream()
                .filter(task -> task.getBudget() != null)
                .map(task -> task.getBudget().getId().toString().replaceAll("[⟨⟩]", ""))
                .distinct()
                .toList();
                
            if (!budgetIds.isEmpty()) {
                List<Budget> budgets = budgetService.getAllBudgets().getBody();
                if (budgets != null) {
                    Map<String, Budget> budgetMap = budgets.stream()
                        .collect(Collectors.toMap(
                            budget -> budget.getId().getId().toString().replaceAll("[⟨⟩]", ""),
                            Function.identity()
                        ));
                        
                    for (Task task : tasks) {
                        if (task.getBudget() != null) {
                            String budgetId = task.getBudget().getId().toString().replaceAll("[⟨⟩]", "");
                            Budget budget = budgetMap.get(budgetId);
                            if (budget != null) {
                                task.setBudgetDetail(budget);
                            }
                        }
                    }
                }
            }
        }
        
        return tasks;
    }
}
