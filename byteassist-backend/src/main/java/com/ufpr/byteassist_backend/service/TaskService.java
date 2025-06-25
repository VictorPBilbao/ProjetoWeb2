package com.ufpr.byteassist_backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.surrealdb.RecordId;
import com.ufpr.byteassist_backend.exception.EnhancedStatusException;
import com.ufpr.byteassist_backend.model.Comment;
import com.ufpr.byteassist_backend.model.Task;
import com.ufpr.byteassist_backend.model.User;
import com.ufpr.byteassist_backend.repository.TaskRepoInterface;
import com.ufpr.byteassist_backend.util.TaskExpander;

@Service
public class TaskService {
    private final TaskRepoInterface taskRepo;
    private final TaskExpander taskExpander;
    private final CommentService commentService;

    public TaskService(TaskRepoInterface taskRepo, TaskExpander taskExpander, CommentService commentService) {
        this.taskRepo = taskRepo;
        this.taskExpander = taskExpander;
        this.commentService = commentService;
    }

    public ResponseEntity<List<Task>> getTasksByUsername(String username, String type, List<String> expand) {
        Optional<List<Task>> tasks = taskRepo.getTasksByUsername(username, type);
        if (tasks.isEmpty()) {
            throw new EnhancedStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error retrieving all tasks from database",
                    "There was a problem accessing the database to retrieve the list of tasks");
        }

        // Expand tasks if requested
        List<Task> expandedTasks = taskExpander.expandTasks(tasks.get(), expand);
        return ResponseEntity.ok(expandedTasks);
    }

    public ResponseEntity<List<Task>> getTasksByUsernameAndStatus(String username, String type, String status,
            List<String> expand) {
        Optional<List<Task>> tasks = taskRepo.getTasksByUsernameAndStatus(username, type, status);
        if (tasks.isEmpty()) {
            throw new EnhancedStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error retrieving all tasks from database",
                    "There was a problem accessing the database to retrieve the list of tasks");
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
                    "No task found with the provided ID");
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
                    "There was a problem accessing the database to create the task");
        }

        // * Create a initial comment for the task
        Comment comment = new Comment();
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        comment.setIn(new RecordId("User", "byteassist-bot"));
        comment.setOut(createdTask.get().getId());
        comment.setComment("Solicitação criada por _" + user.getUsername() + "_");

        commentService.createComment(comment);

        // Expand task if requested
        Task expandedTask = taskExpander.expandTask(createdTask.get(), expand);
        return ResponseEntity.status(HttpStatus.CREATED).body(expandedTask);
    }

    public ResponseEntity<Task> updateTask(String id, Task task, List<String> expand) {
        
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        // * pegar a task atual para ver com oestá */
        Task existingTask = taskRepo.getTaskById(id).orElseThrow(
                () -> new EnhancedStatusException(
                        HttpStatus.NOT_FOUND,
                        "Task not found",
                        "No task found with the provided ID"));

        Task updatedTask = taskRepo.updateTask(task, id).orElseThrow(
                () -> new EnhancedStatusException(
                        HttpStatus.NOT_FOUND,
                        "Task not found",
                        "No task found with the provided ID"));


        // Generate update comments based on what fields were changed
        
        // Handle status changes with specific messages for status transitions
        if (task.getStatus() != null && !existingTask.getStatus().equals(task.getStatus())) {
            String statusComment = generateStatusUpdateComment(existingTask.getStatus(), task.getStatus(), user.getUsername());
            createUpdateComment(updatedTask.getId(), statusComment);
        }
        
        // Handle assignee changes (redirection)
        if (task.getAssignee() != null && (existingTask.getAssignee() == null || 
            !existingTask.getAssignee().getId().equals(task.getAssignee().getId()))) {
            String assigneeComment = "**📋 Responsável alterado** para _" + task.getAssignee().getId() + 
                                   "_ por _" + user.getUsername() + "_. Solicitação **redirecionada** 🔄";
            createUpdateComment(updatedTask.getId(), assigneeComment);
        }
        
        // Handle budget changes (new budget only - budgets cannot be updated)
        if (task.getBudget() != null && (existingTask.getBudget() == null || 
            !existingTask.getBudget().getId().equals(task.getBudget().getId()))) {
            String budgetComment = "**💰 Orçamento adicionado** por _" + user.getUsername() + "_ 📊";
            createUpdateComment(updatedTask.getId(), budgetComment);
        }

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
                    "No task found with the provided ID");
        }
        return ResponseEntity.noContent().build();
    }

    public ResponseEntity<List<Task>> getAllTasks(List<String> expand) {
        Optional<List<Task>> tasks = taskRepo.getAllTasks();
        if (tasks.isEmpty()) {
            throw new EnhancedStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error retrieving all tasks from database",
                    "There was a problem accessing the database to retrieve the list of tasks");
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
                        "No task found with the provided ID"));
        if (task.getCreator().getId().equals(new RecordId("Task", username).getId())) {
            return true;
        } else {
            throw new EnhancedStatusException(
                    HttpStatus.FORBIDDEN,
                    "Forbidden",
                    "You are not the creator of this task");
        }
    }

    public void createUpdateComment(RecordId task, String text) {
        Comment comment = new Comment();
        comment.setIn(new RecordId("User", "byteassist-bot"));
        comment.setOut(task);
        comment.setComment(text);

        commentService.createComment(comment);
    }

    private String generateStatusUpdateComment(String fromStatus, String toStatus, String username) {
        String transition = fromStatus + "_TO_" + toStatus;
        
        switch (transition) {
            case "ABERTA_TO_ORÇADA":
                return "**📋 Solicitação orçada** por _" + username + "_ 💰";
                
            case "ORÇADA_TO_REJEITADA":
                return "**❌ Solicitação rejeitada** por _" + username + "_ 🚫";
                
            case "REJEITADA_TO_APROVADA":
                return "**🔄 Solicitação resgatada** por _" + username + "_ ✨";
                
            case "ORÇADA_TO_APROVADA":
                return "**✅ Solicitação aprovada** por _" + username + "_ 🎉";
                
            case "APROVADA_TO_ARRUMADA":
                return "**🔧 Solicitação arrumada** por _" + username + "_ 🛠️";
                
            case "ARRUMADA_TO_PAGA":
                return "**💳 Solicitação paga** por _" + username + "_ 💰";
                
            case "PAGA_TO_FINALIZADA":
                return "**🏁 Solicitação finalizada** por _" + username + "_ ✅";
                
            default:
                return "**🔄 Solicitação atualizada** por _" + username + "_ - Status: _" + toStatus + "_ 📝";
        }
    }
}
