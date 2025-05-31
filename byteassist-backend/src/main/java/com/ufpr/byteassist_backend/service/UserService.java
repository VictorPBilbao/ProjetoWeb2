package com.ufpr.byteassist_backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.ufpr.byteassist_backend.exception.EnhancedStatusException;
import com.ufpr.byteassist_backend.model.User;
import com.ufpr.byteassist_backend.repository.UserRepoInterface;
import com.ufpr.byteassist_backend.util.UserExpander;

@Service
public class UserService {
    private final UserRepoInterface userRepo;
    private final UserExpander userExpander;
    
    public UserService(UserRepoInterface userRepo, UserExpander userExpander) {
        this.userRepo = userRepo;
        this.userExpander = userExpander;
    }
    
    public ResponseEntity<User> getUser(String username, List<String> expand) {
        Optional<User> user = userRepo.getUser(username);
        if (user.isEmpty()) {
            throw new EnhancedStatusException(
                HttpStatus.NOT_FOUND,
                "User with username " + username + " not found",
                "The user with the specified username does not exist"
            );
        }
        
        // Use our utility to expand the user if needed
        User expandedUser = userExpander.expandUser(user.get(), expand);
        return ResponseEntity.ok(expandedUser);
    }

    public ResponseEntity<User> createUser(User user, String username, List<String> expand) {
        Optional<User> createdUser = userRepo.createUser(user, username);
        if (createdUser.isEmpty()) {
            throw new EnhancedStatusException(
                HttpStatus.CONFLICT,
                "User with username " + username + " already exists or database error occurred",
                "The user could not be created because the username is already taken or there was a database error"
            );
        }
        
        // Use our utility to expand the user if needed
        User expandedUser = userExpander.expandUser(createdUser.get(), expand);
        return ResponseEntity.status(HttpStatus.CREATED).body(expandedUser);
    }
    
    public ResponseEntity<User> updateUser(User user, String username, List<String> expand) {
        Optional<User> updatedUser = userRepo.updateUser(user, username);
        if (updatedUser.isEmpty()) {
            throw new EnhancedStatusException(
                HttpStatus.NOT_FOUND,
                "User with username " + username + " not found",
                "The user with the specified username does not exist and cannot be updated"
            );
        }
        
        // Use our utility to expand the user if needed
        User expandedUser = userExpander.expandUser(updatedUser.get(), expand);
        return ResponseEntity.ok(expandedUser);
    }
    
    public ResponseEntity<Void> deleteUser(String username) {
        boolean deleted = userRepo.deleteUser(username);
        if (!deleted) {
            throw new EnhancedStatusException(
                HttpStatus.NOT_FOUND,
                "User with username " + username + " not found",
                "The user with the specified username does not exist and cannot be deleted"
            );
        }
        return ResponseEntity.noContent().build();
    }
    
    public ResponseEntity<List<User>> getAllUsers(List<String> expand) {
        Optional<List<User>> users = userRepo.getAllUsers();
        if (users.isEmpty()) {
            throw new EnhancedStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Error retrieving all users from database",
                "There was a problem accessing the database to retrieve the list of users"
            );
        }
        
        // Use our utility to expand all users efficiently
        List<User> expandedUsers = userExpander.expandUsers(users.get(), expand);
        return ResponseEntity.ok(expandedUsers);
    }
}
