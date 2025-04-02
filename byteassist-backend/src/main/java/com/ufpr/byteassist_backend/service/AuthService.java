package com.ufpr.byteassist_backend.service;

import com.ufpr.byteassist_backend.dto.UserDTO;
import com.ufpr.byteassist_backend.exception.ErrorResponse;
import com.ufpr.byteassist_backend.model.User;
import com.ufpr.byteassist_backend.repository.UpdateTimeRepo;
import com.ufpr.byteassist_backend.repository.UserRepo;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepo userRepo;
    private final UpdateTimeRepo updateTimeRepo;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder passwordEncoder;

    // Constructor injection
    public AuthService(UserRepo userRepo, UpdateTimeRepo updateTimeRepo, JwtService jwtService) {
        this.userRepo = userRepo;
        this.updateTimeRepo = updateTimeRepo;
        this.jwtService = jwtService;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public ResponseEntity<Object> login(String username, String password) {
        User user = userRepo.getUserByUsername(username);
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            String token = jwtService.generateToken(user.getId().toString(), user.getUsername());
            UserDTO userDTO = new UserDTO(
                    user.getId().toString(),
                    user.getUsername(),
                    user.getCreated_at(),
                    user.getLast_login_at(),
                    user.is_active(),
                    token);
            // Update last login time
            updateTimeRepo.updateTimeLastLogin(user.getId().toString());
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