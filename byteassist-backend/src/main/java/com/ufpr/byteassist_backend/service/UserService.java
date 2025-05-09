package com.ufpr.byteassist_backend.service;

import java.util.Iterator;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.ufpr.byteassist_backend.exception.EnhancedStatusException;
import com.ufpr.byteassist_backend.model.User;
import com.ufpr.byteassist_backend.repository.UserRepoInterface;

@Service
public class UserService {
    private final UserRepoInterface userRepo;
    
    public UserService(UserRepoInterface userRepo) {
        this.userRepo = userRepo;
    }
    
    public ResponseEntity<User> getUser(String username) {
        Optional<User> user = userRepo.getUser(username);
        if (user.isEmpty()) {
            throw new EnhancedStatusException(
                HttpStatus.NOT_FOUND,
                "User with username " + username + " not found",
                "The user with the specified username does not exist"
            );
        }
        return ResponseEntity.ok(user.get());
    }
    
    public ResponseEntity<User> createUser(User user, String username) {
        Optional<User> createdUser = userRepo.createUser(user, username);
        if (createdUser.isEmpty()) {
            throw new EnhancedStatusException(
                HttpStatus.CONFLICT,
                "User with username " + username + " already exists or database error occurred",
                "The user could not be created because the username is already taken or there was a database error"
            );
        }
        return ResponseEntity.ok(createdUser.get());
    }
    
    public ResponseEntity<User> updateUser(User user, String username) {
        Optional<User> updatedUser = userRepo.updateUser(user, username);
        if (updatedUser.isEmpty()) {
            throw new EnhancedStatusException(
                HttpStatus.NOT_FOUND,
                "User with username " + username + " not found",
                "The user with the specified username does not exist and cannot be updated"
            );
        }
        return ResponseEntity.ok(updatedUser.get());
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
    
    public ResponseEntity<Iterator<User>> getAllUsers() {
        Optional<Iterator<User>> users = userRepo.getAllUsers();
        if (users.isEmpty()) {
            throw new EnhancedStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Error retrieving all users from database",
                "There was a problem accessing the database to retrieve the list of users"
            );
        }
        return ResponseEntity.ok(users.get());
    }
}
