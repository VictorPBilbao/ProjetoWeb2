package com.ufpr.byteassist_backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ufpr.byteassist_backend.model.Task;
import com.ufpr.byteassist_backend.service.TaskService;

@RestController
@RequestMapping("/api/task")
public class TaskController {
    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }
    
    // Define endpoints for task operations here, e.g.:
    @GetMapping("/byUsername/{username:[a-z0-9._]{3,30}}")
    public ResponseEntity<List<Task>> getTasksByUsername(
            @PathVariable String username,
            @RequestParam(name = "type", defaultValue = "creator") String type) {
        
        // Validate that type is either "creator" or "asignee"
        if (!type.equals("creator") && !type.equals("asignee")) {
            throw new IllegalArgumentException("Type parameter must be either 'creator' or 'asignee'");
        }
        
        return taskService.getTasksByUsername(username, type);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable String id) {
        return taskService.getTaskById(id);
    }
    
    @PostMapping()
    public ResponseEntity<Task> createTask(@Validated @RequestBody Task task) {
        return taskService.createTask(task);
    }
}
