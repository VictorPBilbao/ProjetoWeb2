package com.ufpr.byteassist_backend.repository;

import java.util.List;
import java.util.Optional;

import com.ufpr.byteassist_backend.model.Task;

public interface TaskRepoInterface {
    public Optional<List<Task>> getTasksByUsername(String username, String type); // Retrieve tasks by username with type filter
}
