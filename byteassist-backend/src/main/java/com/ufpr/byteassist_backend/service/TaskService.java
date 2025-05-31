package com.ufpr.byteassist_backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.surrealdb.RecordId;
import com.ufpr.byteassist_backend.exception.EnhancedStatusException;
import com.ufpr.byteassist_backend.model.Task;
import com.ufpr.byteassist_backend.repository.TaskRepoInterface;
import com.ufpr.byteassist_backend.util.TaskExpander;


@Service
public class TaskService {
    private final TaskRepoInterface taskRepo;
    private final TaskExpander taskExpander;

    public TaskService(TaskRepoInterface taskRepo, TaskExpander taskExpander) {
        this.taskRepo = taskRepo;
        this.taskExpander = taskExpander;
    }

    public ResponseEntity<List<Task>> getTasksByUsername(String username, String type, List<String> expand) {
        Optional<List<Task>> tasks = taskRepo.getTasksByUsername(username, type);
        if (tasks.isEmpty()) {
            throw new EnhancedStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Error retrieving all tasks from database",
                "There was a problem accessing the database to retrieve the list of tasks"
            );
        }
        
        // Expand tasks if requested
        List<Task> expandedTasks = taskExpander.expandTasks(tasks.get(), expand);
        return ResponseEntity.ok(expandedTasks);
    }
    
    public ResponseEntity<List<Task>> getTasksByUsernameAndStatus(String username, String type, String status, List<String> expand) {
        Optional<List<Task>> tasks = taskRepo.getTasksByUsernameAndStatus(username, type, status);
        if (tasks.isEmpty()) {
            throw new EnhancedStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Error retrieving all tasks from database",
                "There was a problem accessing the database to retrieve the list of tasks"
            );
        }
        
        // Expand tasks if requested
        List<Task> expandedTasks = taskExpander.expandTasks(tasks.get(), expand);
        return ResponseEntity.ok(expandedTasks);
    }
    
    public ResponseEntity<Task> getTaskById(String id, List<String> expand) {
        Optional<Task> task = taskRepo.getTaskById(id);
        if (task.isEmpty()) {
            throw new EnhancedStatusException(
                HttpStatus.NOT_FOUND,
                "Task not found",
                "No task found with the provided ID"
            );
        }
        
        // Expand task if requested
        Task expandedTask = taskExpander.expandTask(task.get(), expand);
        return ResponseEntity.ok(expandedTask);
    }
    
    public ResponseEntity<Task> createTask(Task task, List<String> expand) {
        Optional<Task> createdTask = taskRepo.createTask(task);
        if (createdTask.isEmpty()) {
            throw new EnhancedStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Error creating task",
                "There was a problem accessing the database to create the task"
            );
        }
        
        // Expand task if requested
        Task expandedTask = taskExpander.expandTask(createdTask.get(), expand);
        return ResponseEntity.status(HttpStatus.CREATED).body(expandedTask);
    }

    public ResponseEntity<Task> updateTask(String id, Task task, List<String> expand) {
        Task updatedTask = taskRepo.updateTask(task, id).orElseThrow(
            () -> new EnhancedStatusException(
                HttpStatus.NOT_FOUND,
                "Task not found",
                "No task found with the provided ID"
            ));
            
        // Expand task if requested
        Task expandedTask = taskExpander.expandTask(updatedTask, expand);
        return ResponseEntity.ok(expandedTask);
    }
    
    public ResponseEntity<Void> deleteTask(String id) {
        boolean deleted = taskRepo.deleteTask(id);
        if (!deleted) {
            throw new EnhancedStatusException(
                HttpStatus.NOT_FOUND,
                "Task not found",
                "No task found with the provided ID"
            );
        }
        return ResponseEntity.noContent().build();
    }
    
    public ResponseEntity<List<Task>> getAllTasks(List<String> expand) {
        Optional<List<Task>> tasks = taskRepo.getAllTasks();
        if (tasks.isEmpty()) {
            throw new EnhancedStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Error retrieving all tasks from database",
                "There was a problem accessing the database to retrieve the list of tasks"
            );
        }
        
        // Expand tasks if requested
        List<Task> expandedTasks = taskExpander.expandTasks(tasks.get(), expand);
        return ResponseEntity.ok(expandedTasks);
    }
    
    public boolean isTaskCreator(String taskId, String username) {
        Task task = taskRepo.getTaskById(taskId).orElseThrow(
            () -> new EnhancedStatusException(
                HttpStatus.NOT_FOUND,
                "Task not found",
                "No task found with the provided ID"
            )
        );
        if (task.getCreator().getId().equals(new RecordId("Task", username).getId())) {
            return true;
        } else {
            throw new EnhancedStatusException(
            HttpStatus.FORBIDDEN,
            "Forbidden",
            "You are not the creator of this task"
            );
        }
    }
}
