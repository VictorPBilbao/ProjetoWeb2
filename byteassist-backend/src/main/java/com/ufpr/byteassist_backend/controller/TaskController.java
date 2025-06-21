package com.ufpr.byteassist_backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ufpr.byteassist_backend.exception.EnhancedStatusException;
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
    public ResponseEntity<List<Task>> getAllTasks(
            @RequestParam(required = false) List<String> expand) {
        return taskService.getAllTasks(expand);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(
            @PathVariable String id,
            @RequestParam(required = false) List<String> expand) {
        ResponseEntity<Task> response = taskService.getTaskById(id, expand);
        Task task = response.getBody();

        if (task != null) {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User currentUser = (User) authentication.getPrincipal(); // Assuming User is your custom principal

            boolean isManager = authentication.getAuthorities().stream()
                    .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_EMPLOYEE"));

            if (task.getCreator() != null && !task.getCreator().equals(currentUser.getId()) && !isManager) {
                throw new EnhancedStatusException(
                        HttpStatus.FORBIDDEN,
                        "Access Denied",
                        "You do not have permission to access this task");
            }
        }
        return response;
    }

    @GetMapping("/byUsername/{username:[a-z0-9._]{3,30}}")
    @PreAuthorize("hasRole('ADMIN') or #username == authentication.principal.username")
    public ResponseEntity<List<Task>> getTasksByUsername(
            @PathVariable String username,
            @RequestParam(defaultValue = "creator") String type,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) List<String> expand) {

        // Validate that type is either "creator" or "assignee"
        if (!type.equals("creator") && !type.equals("assignee")) {
            throw new IllegalArgumentException("Type parameter must be either 'creator' or 'assignee'");
        }

        // valid status: 'Aguardando Orçamento' | 'Aguardando Aprovação' | 'Aguardando
        // Peças' | 'Em Andamento' | 'Concluído' | 'Rejeitado'
        if (status != null && !java.util.regex.Pattern
                .compile("Aguardando Orçamento|Aguardando Aprovação|Aguardando Peças|Em Andamento|Concluído|Rejeitado",
                        java.util.regex.Pattern.CANON_EQ)
                .matcher(status).matches()) {
            throw new IllegalArgumentException(
                    "Status parameter must be one of: 'Aguardando Orçamento', 'Aguardando Aprovação', 'Aguardando Peças', 'Em Andamento', 'Concluído', 'Rejeitado'");
        }

        if (status != null) {
            return taskService.getTasksByUsernameAndStatus(username, type, status, expand);
        }

        return taskService.getTasksByUsername(username, type, expand);
    }

    @GetMapping("/me")
    public ResponseEntity<List<Task>> getCurrentUserTasks(
            @RequestParam(defaultValue = "creator") String type,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) List<String> expand) {

        // Validate that type is either "creator" or "assignee"
        if (!type.equals("creator") && !type.equals("assignee")) {
            throw new IllegalArgumentException("Type parameter must be either 'creator' or 'assignee'");
        }

        // valid status: 'ABERTA' | 'FINALIZADA' | 'ORÇADA' | 'PAGA' | 'REDIRECIONADA' | 'REJEITADA' | 'ARRUMADA' | 'APROVADA'
        if (status != null && !java.util.regex.Pattern
                .compile("ABERTA|FINALIZADA|ORÇADA|PAGA|REDIRECIONADA|REJEITADA|ARRUMADA|APROVADA",
                        java.util.regex.Pattern.CANON_EQ)
                .matcher(status).matches()) {
            throw new IllegalArgumentException(
                    "Status parameter must be one of: 'ABERTA', 'FINALIZADA', 'ORÇADA', 'PAGA', 'REDIRECIONADA', 'REJEITADA', 'ARRUMADA', 'APROVADA'");
        }

        // Get the current user from the security context
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (status != null) {
            return taskService.getTasksByUsernameAndStatus(user.getUsername(), type, status, expand);
        }

        return taskService.getTasksByUsername(user.getUsername(), type, expand);
    }

    @PostMapping()
    public ResponseEntity<Task> createTask(
            @Validated(ValidationGroups.Create.class) @RequestBody Task task,
            @RequestParam(required = false) List<String> expand) {
        // get the current user from the security context
        // and set it as the creator of the task
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        task.setCreator(user.getId());

        return taskService.createTask(task, expand);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Task> updateTask(
            @PathVariable String id,
            @Validated(ValidationGroups.Update.class) @RequestBody Task task,
            @RequestParam(required = false) List<String> expand) {
        // get the current user from the security context
        // User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();


        
        return taskService.updateTask(id, task, expand);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<Void> deleteTask(@PathVariable String id) {
        return taskService.deleteTask(id);
    }

}
