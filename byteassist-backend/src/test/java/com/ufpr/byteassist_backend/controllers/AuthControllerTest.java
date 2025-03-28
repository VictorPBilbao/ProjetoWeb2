package com.ufpr.byteassist_backend.controllers;

import com.ufpr.byteassist_backend.controller.AuthController;
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
        String username = "TestUser";
        String password = "Hesoyam10$";

        when(mockAuthService.login(username, password))
                .thenReturn(ResponseEntity.ok("Login successful"));

        ResponseEntity<Object> response = authController.login(username, password);

        assertEquals(200, response.getStatusCode().value(), "The status code should be 200 for valid credentials.");
        assertEquals("Login successful", response.getBody(), "The response body should indicate a successful login.");
        verify(mockAuthService, times(1)).login(username, password);
    }

    @Test
    void testLoginWithInvalidCredentials() {
        String username = "InvalidUser";
        String password = "WrongPassword";

        when(mockAuthService.login(username, password))
                .thenReturn(ResponseEntity.status(401).body("Invalid credentials"));

        ResponseEntity<Object> response = authController.login(username, password);

        assertEquals(401, response.getStatusCode().value(), "The status code should be 401 for invalid credentials.");
        assertEquals("Invalid credentials", response.getBody(),
                "The response body should indicate invalid credentials.");
        verify(mockAuthService, times(1)).login(username, password);
    }
}
