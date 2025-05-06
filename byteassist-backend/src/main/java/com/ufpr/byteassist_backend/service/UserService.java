package com.ufpr.byteassist_backend.service;

import java.util.Iterator;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.ufpr.byteassist_backend.exception.ErrorResponse;
import com.ufpr.byteassist_backend.model.User;
import com.ufpr.byteassist_backend.repository.UserRepoInterface;

@Service
public class UserService {
    private final UserRepoInterface userRepo;
    
    public UserService(UserRepoInterface userRepo) {
        this.userRepo = userRepo;
    }
    
    public ResponseEntity<Object> getUser(String username) {
        Optional<User> user = userRepo.getUser(username);
        if (user.isEmpty()) {
            ErrorResponse errorResponse = ErrorResponse.builder()
                    .message("User not found")
                    .errorCode(HttpStatus.NOT_FOUND)
                    .statusCode(HttpStatus.NOT_FOUND.value())
                    .errorDescription("User with username " + username + " not found")
                    .build();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
        return ResponseEntity.ok(user.get());
    }
    
    public ResponseEntity<Object> createUser(User user, String username) {
        Optional<User> createdUser = userRepo.createUser(user, username);
        System.out.println("Created user: " + createdUser);
        if (createdUser.isEmpty()) {
            ErrorResponse errorResponse = ErrorResponse.builder()
                    .message("Failed to create user")
                    .errorCode(HttpStatus.CONFLICT)
                    .statusCode(HttpStatus.CONFLICT.value())
                    .errorDescription("User with username " + username + " already exists")
                    .build();
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
        }
        return ResponseEntity.ok(createdUser.get());
    }
    
    public ResponseEntity<Object> updateUser(User user, String username) {
        Optional<User> updatedUser = userRepo.updateUser(user, username);
        if (updatedUser.isEmpty()) {
            ErrorResponse errorResponse = ErrorResponse.builder()
                    .message("Failed to update user")
                    .errorCode(HttpStatus.NOT_FOUND)
                    .statusCode(HttpStatus.NOT_FOUND.value())
                    .errorDescription("User with username " + username + " not found")
                    .build();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
        return ResponseEntity.ok(updatedUser.get());
    }
    
    public ResponseEntity<Object> deleteUser(String username) {
        boolean deleted = userRepo.deleteUser(username);
        if (!deleted) {
            ErrorResponse errorResponse = ErrorResponse.builder()
                    .message("Failed to delete user")
                    .errorCode(HttpStatus.NOT_FOUND)
                    .statusCode(HttpStatus.NOT_FOUND.value())
                    .errorDescription("User with username " + username + " not found")
                    .build();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
        return ResponseEntity.noContent().build();
    }
    
    public ResponseEntity<Object> getAllUsers() {
        Optional<Iterator<User>> users = userRepo.getAllUsers();
        if (users.isEmpty()) {
            ErrorResponse errorResponse = ErrorResponse.builder()
                    .message("Failed to retrieve users")
                    .errorCode(HttpStatus.INTERNAL_SERVER_ERROR)
                    .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .errorDescription("Error retrieving all users from database")
                    .build();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
        return ResponseEntity.ok(users.get());
    }
}
