package com.ufpr.byteassist_backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
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

import com.ufpr.byteassist_backend.dto.DetailedTaskDTO;
import com.ufpr.byteassist_backend.model.Task;
import com.ufpr.byteassist_backend.model.User;
import com.ufpr.byteassist_backend.service.TaskService;
import com.ufpr.byteassist_backend.validation.ValidationGroups;

@RestController
@RequestMapping("/api/task")
public class TaskController {
    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping()
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<Task>> getAllTasks() {
        return taskService.getAllTasks();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable String id) {
        return taskService.getTaskById(id);
    }

    @GetMapping("/byUsername/{username:[a-z0-9._]{3,30}}")
    @PreAuthorize("hasRole('ADMIN') or #username == authentication.principal.username")
    public ResponseEntity<List<Task>> getTasksByUsername(
            @PathVariable String username,
            @RequestParam(name = "type", defaultValue = "creator") String type,
            @RequestParam(name = "status", required = false) String status) {

        // Validate that type is either "creator" or "assignee"
        if (!type.equals("creator") && !type.equals("assignee")) {
            throw new IllegalArgumentException("Type parameter must be either 'creator' or 'assignee'");
        }

        // valid status: 'Aguardando Orçamento' | 'Aguardando Aprovação' | 'Aguardando Peças' | 'Em Andamento' | 'Concluído' | 'Rejeitado'
        if (status != null && !java.util.regex.Pattern.compile("Aguardando Orçamento|Aguardando Aprovação|Aguardando Peças|Em Andamento|Concluído|Rejeitado", java.util.regex.Pattern.CANON_EQ).matcher(status).matches()) {
            throw new IllegalArgumentException("Status parameter must be one of: 'Aguardando Orçamento', 'Aguardando Aprovação', 'Aguardando Peças', 'Em Andamento', 'Concluído', 'Rejeitado'");
        }
        
        if (status != null) {
            return taskService.getTasksByUsernameAndStatus(username, type, status);
        }

        return taskService.getTasksByUsername(username, type);
    }
    
    @GetMapping("/me")
    public ResponseEntity<List<Task>> getCurrentUserTasks(
            @RequestParam(name = "type", defaultValue = "creator") String type, 
            @RequestParam(name = "status", required = false) String status) {

        // Validate that type is either "creator" or "assignee"
        if (!type.equals("creator") && !type.equals("assignee")) {
            throw new IllegalArgumentException("Type parameter must be either 'creator' or 'assignee'");
        }

        // valid status: 'Aguardando Orçamento' | 'Aguardando Aprovação' | 'Aguardando Peças' | 'Em Andamento' | 'Concluído' | 'Rejeitado'
        if (status != null && !java.util.regex.Pattern.compile("Aguardando Orçamento|Aguardando Aprovação|Aguardando Peças|Em Andamento|Concluído|Rejeitado", java.util.regex.Pattern.CANON_EQ).matcher(status).matches()) {
            throw new IllegalArgumentException("Status parameter must be one of: 'Aguardando Orçamento', 'Aguardando Aprovação', 'Aguardando Peças', 'Em Andamento', 'Concluído', 'Rejeitado'");
        }

        // Get the current user from the security context
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (status != null) {
            return taskService.getTasksByUsernameAndStatus(user.getUsername(), type, status);
        }

        return taskService.getTasksByUsername(user.getUsername(), type);
    }
    
    @GetMapping("detailed/me")
    public ResponseEntity<List<DetailedTaskDTO>> getCurrentUserDetailedTasks(
        @RequestParam(name = "type", defaultValue = "creator") String type) {

        // Validate that type is either "creator" or "assignee"
        if (!type.equals("creator") && !type.equals("assignee")) {
            throw new IllegalArgumentException("Type parameter must be either 'creator' or 'assignee'");
        }

        // Get the current user from the security context
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        return taskService.getCurrentUserDetailedTasks(user.getId().getId().toString(), type);
    }

    @PostMapping()
    public ResponseEntity<Task> createTask(@Validated(ValidationGroups.Create.class) @RequestBody Task task) {
        // get the current user from the security context
        // and set it as the creator of the task
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        task.setCreator(user.getId());

        return taskService.createTask(task);
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<Task> updateTask(@PathVariable String id, @Validated(ValidationGroups.Update.class) @RequestBody Task task) {
        // get the current user from the security context
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // Set the current user ID as the task creator if already not set
        if (task.getCreator() == null) {
            task.setCreator(user.getId());
        }

        return taskService.updateTask(id, task);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<Void> deleteTask(@PathVariable String id) {
        return taskService.deleteTask(id);
    }

}
