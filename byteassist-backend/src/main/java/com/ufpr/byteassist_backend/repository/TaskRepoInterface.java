package com.ufpr.byteassist_backend.repository;

import java.util.List;
import java.util.Optional;

import com.ufpr.byteassist_backend.dto.DetailedTaskDTO;
import com.ufpr.byteassist_backend.model.Task;

public interface TaskRepoInterface {
    public Optional<List<Task>> getTasksByUsername(String username, String type);
    public Optional<Task> getTaskById(String id);
    public Optional<Task> createTask(Task task);
    public Boolean deleteTask(String id);
    public Optional<Task> updateTask(Task task, String id);
    public Optional<List<Task>> getAllTasks();
    public Optional<List<Task>> getTasksByUsernameAndStatus(String username, String type, String status);
    public Optional<List<DetailedTaskDTO>> getDetailedTasksByUsername(String username, String type);
}
