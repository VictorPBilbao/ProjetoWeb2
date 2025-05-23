package com.ufpr.byteassist_backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ufpr.byteassist_backend.dto.DetailedUserDTO;
import com.ufpr.byteassist_backend.dto.UserDTO;
import com.ufpr.byteassist_backend.service.AuthService;
import com.ufpr.byteassist_backend.validation.ValidationGroups;

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
    public ResponseEntity<UserDTO> login(@RequestParam String username, @RequestParam String password) {
        System.out.println("Login request received with username: " + username + " and password: " + password);
        return authService.login(username, password);
    }

    @PostMapping(value = "/register/{username:[a-z0-9._]{3,30}}")
    public ResponseEntity<UserDTO> registerForm(@Validated(ValidationGroups.Create.class) @RequestBody DetailedUserDTO registrationRequest, @PathVariable String username) {
        return authService.register(registrationRequest, username);
    }

    @GetMapping("/validate/username/{username}")
    public ResponseEntity<HttpStatus> validateUsername(@PathVariable String username) {
        return authService.validateUsername(username);
    }

    @GetMapping("/validate/email/{email}")
    public ResponseEntity<HttpStatus> validateEmail(@PathVariable String email) {
        return authService.validateEmail(email);
    }
}