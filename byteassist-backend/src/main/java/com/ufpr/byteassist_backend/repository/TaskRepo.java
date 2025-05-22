package com.ufpr.byteassist_backend.repository;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Repository;

import com.surrealdb.RecordId;
import com.surrealdb.Response;
import com.surrealdb.Surreal;
import com.surrealdb.UpType;
import com.ufpr.byteassist_backend.model.Task;
import com.ufpr.byteassist_backend.model.User;
import com.ufpr.byteassist_backend.model.UserTime;
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
            return Optional.ofNullable(db.create(Task.class, new RecordId("Task", "BYTE-" + UUID.randomUUID().toString().replace("-", "").substring(0, 5).toUpperCase()), task));
        } catch (Exception e) {
            return Optional.empty();
        }
    }
    
    @Override
    public Boolean deleteTask(String id) {
        try {
            // Remove o registro da tarefa do banco de dados
            db.delete(new RecordId("Task", id));
            return true;
        } catch (Exception e) {
            // Em caso de erro, retorna false
            return false;
        }
    }

    @Override
    public Optional<Task> updateTask(Task task, String id) {
        try {
            // Atualiza apenas os campos fornecidos (MERGE) no registro da tarefa
            return Optional.ofNullable(db.update(Task.class, new RecordId("Task", id), UpType.MERGE, task));
        } catch (Exception e) {
            // Em caso de erro, retorna Optional vazio
            return Optional.empty();
        }
    }
}
