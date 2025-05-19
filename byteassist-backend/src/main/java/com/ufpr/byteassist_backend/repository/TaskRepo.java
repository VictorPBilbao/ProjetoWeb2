package com.ufpr.byteassist_backend.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Repository;

import com.surrealdb.RecordId;
import com.surrealdb.Response;
import com.surrealdb.Surreal;
import com.ufpr.byteassist_backend.model.Task;
import com.ufpr.byteassist_backend.service.DatabaseService;

@Repository
public class TaskRepo implements TaskRepoInterface {
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
            return Optional.of(tasks);
        } catch (Exception e) {
            // Handle exceptions and return an empty Optional in case of errors
            return Optional.empty();
        }
    }
    
    @Override
    public Optional<Task> getTaskById(String id) {
        try {
            return db.select(Task.class, new RecordId("Task", id));
        } catch (Exception e) {
            return Optional.empty();
        }
    }
    
    @Override
    public Optional<Task> createTask(Task task) {
        try {
            System.out.println(task);
            System.out.println(UUID.randomUUID().toString().replace("-", "").substring(0, 10).toUpperCase());
            return Optional.ofNullable(db.create(Task.class, new RecordId("Task", UUID.randomUUID().toString().replace("-", "").substring(0, 7).toUpperCase()), task));
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}
