package com.ufpr.byteassist_backend.controller;

import com.ufpr.byteassist_backend.dto.RegistrationRequestDTO;
import com.ufpr.byteassist_backend.service.AuthService;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

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
    public ResponseEntity<Object> login(@RequestParam String username, @RequestParam String password) {
        System.out.println("Login request received with username: " + username + " and password: " + password);
        return authService.login(username, password);
    }

    @PostMapping(value = "/register", consumes = { MediaType.APPLICATION_FORM_URLENCODED_VALUE })
    public ResponseEntity<Object> registerForm(@Valid @ModelAttribute RegistrationRequestDTO registrationRequest,
            BindingResult bindingResult) {
        System.out.println("Form registration request received: " + registrationRequest);
        return authService.register(registrationRequest, bindingResult);
    }

    @GetMapping("/validate/username/{username}")
    public ResponseEntity<Object> validateUsername(@PathVariable String username) {
        return authService.validateUsername(username);
    }

    @GetMapping("/validate/email/{email}")
    public ResponseEntity<Object> validateEmail(@PathVariable String email) {
        return authService.validateEmail(email);
    }
}