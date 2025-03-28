package com.ufpr.byteassist_backend.controller;

import com.ufpr.byteassist_backend.dto.UserDTO;
import com.ufpr.byteassist_backend.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/health")
    public String health() {
        return "OK";
    }

    @PostMapping("/login")
    public UserDTO login(@RequestParam String username, @RequestParam String password) {
        return authService.login(username, password);
    }
}