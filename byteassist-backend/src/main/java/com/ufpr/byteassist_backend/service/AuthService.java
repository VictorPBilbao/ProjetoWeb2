package com.ufpr.byteassist_backend.service;

import com.ufpr.byteassist_backend.dto.UserDTO;
import com.ufpr.byteassist_backend.exception.ErrorResponse;
import com.ufpr.byteassist_backend.model.User;
import com.ufpr.byteassist_backend.repository.UserRepo;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepo userRepo;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(DatabaseService databaseService, JwtService jwtService) {
        this.userRepo = new UserRepo(databaseService);
        this.jwtService = jwtService;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public ResponseEntity<Object> login(String username, String password) {
        User user = userRepo.getUserByUsername(username, password);
        if (user != null && passwordEncoder.matches(password, user.password)) {
            String token = jwtService.generateToken(user.id.toString(), user.username);
            UserDTO userDTO = new UserDTO(user.id.toString(), user.username, token);
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