package com.ufpr.byteassist_backend.service;

import com.ufpr.byteassist_backend.dto.UserDTO;
import com.ufpr.byteassist_backend.exception.ErrorResponse;
import com.ufpr.byteassist_backend.model.User;
import com.ufpr.byteassist_backend.repository.UserRepo;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepo userRepo;

    public AuthService(DatabaseService databaseService) {
        this.userRepo = new UserRepo(databaseService);
    }

    public ResponseEntity<?> login(String username, String password) {
        User user = userRepo.getUserByUsername(username, password);
        if (user != null && user.password.equals(password)) {
            UserDTO userDTO = new UserDTO(user.id.toString(), user.username);
            return new ResponseEntity<>(userDTO, HttpStatus.OK);
        }
        ErrorResponse errorResponse = ErrorResponse.builder()
                .message("Not authenticated")
                .errorCode(HttpStatus.UNAUTHORIZED)
                .statusCode(HttpStatus.UNAUTHORIZED.value())
                .errorDescription("The provided username or password is incorrect.")
                .build();
        return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
    }
}