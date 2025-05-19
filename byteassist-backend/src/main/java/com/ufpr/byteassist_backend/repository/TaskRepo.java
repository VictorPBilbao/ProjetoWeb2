package com.ufpr.byteassist_backend.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.surrealdb.Response;
import com.surrealdb.Surreal;
import com.ufpr.byteassist_backend.model.Task;
import com.ufpr.byteassist_backend.service.DatabaseService;

@Repository
public class TaskRepo implements TaskRepoInterface {

    // Implement methods from TaskRepoInterface here
    // For example:
    // @Override
    // public Optional<Task> getTaskById(RecordId id) {
    //     // Implementation logic
    // }

    // Add any additional methods or logic needed for the Task repository
    private final Surreal db;
    
    public TaskRepo(DatabaseService databaseService) {
        this.db = databaseService.getDatabase();
    }
    
    @Override
    public Optional<List<Task>> getTasksByUsername(String username, String type) {
        try {
            // Build query dynamically based on type parameter
            String fieldToQuery = type.equals("creator") ? "creator.id.id()" : "asignee.id.id()";
            String query = "SELECT * FROM Task WHERE " + fieldToQuery + " = $user";
            
            Response response = db.queryBind(query, Map.of("user", username));
            
            List<Task> tasks = new ArrayList<>();
            for (var taskRecord : response.take(0).getArray()) {
                Task task = taskRecord.get(Task.class);
                tasks.add(task);
            }
            System.out.println("Retrieved tasks for user: " + username + " as " + type);
            System.out.println("Tasks: " + tasks);
            return Optional.of(tasks);
        } catch (Exception e) {
            // Handle exceptions and return an empty Optional in case of errors
            return Optional.empty();
        }
    }
    
}
