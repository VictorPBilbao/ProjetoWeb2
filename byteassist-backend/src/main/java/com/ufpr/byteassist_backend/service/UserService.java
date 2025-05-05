package com.ufpr.byteassist_backend.service;

import org.springframework.stereotype.Service;

import com.ufpr.byteassist_backend.model.User;
import com.ufpr.byteassist_backend.repository.UserRepoInterface;

@Service
public class UserService {
    private final UserRepoInterface userRepo;
    
    public UserService(UserRepoInterface userRepo) {
        this.userRepo = userRepo;
    }
    
    public User getUser(String username) {
        return userRepo.getUser(username);
    }

    // Add methods to interact with the user repository as needed
    // For example, you might have methods like getUser, createUser, deleteUser, etc.
}
