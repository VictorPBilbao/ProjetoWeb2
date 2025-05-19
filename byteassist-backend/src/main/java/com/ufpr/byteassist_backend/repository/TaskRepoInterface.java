package com.ufpr.byteassist_backend.repository;

import java.util.List;
import java.util.Optional;

import com.ufpr.byteassist_backend.model.Task;

public interface TaskRepoInterface {
    public Optional<List<Task>> getTasksByUsername(String username, String type);
    public Optional<Task> getTaskById(String id);
    public Optional<Task> createTask(Task task);
}
