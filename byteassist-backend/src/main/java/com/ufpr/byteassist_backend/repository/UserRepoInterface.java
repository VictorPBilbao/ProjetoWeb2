package com.ufpr.byteassist_backend.repository;

import com.ufpr.byteassist_backend.model.User;

public interface UserRepoInterface {
    User getUser(String username); // Retrieve a user record by username
    User createUser(User user, String username); // Create a new user record in the database
    void deleteUser(String username);
}
