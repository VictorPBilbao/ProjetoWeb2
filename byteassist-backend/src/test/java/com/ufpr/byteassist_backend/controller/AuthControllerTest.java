package com.ufpr.byteassist_backend.controller;

import com.ufpr.byteassist_backend.dto.UserDTO;
import com.ufpr.byteassist_backend.service.AuthService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class AuthControllerTest {

    private AuthController authController;
    private AuthService mockAuthService;

    @BeforeEach
    void setUp() {
        mockAuthService = mock(AuthService.class);
        authController = new AuthController(mockAuthService);
    }

    @Test
    void testLoginWithValidCredentials() {
        return;
    }

    @Test
    void testLoginWithInvalidCredentials() {
        return;
    }
}
