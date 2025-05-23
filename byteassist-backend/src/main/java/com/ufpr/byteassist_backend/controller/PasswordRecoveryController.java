package com.ufpr.byteassist_backend.controller;

import com.ufpr.byteassist_backend.service.PasswordRecoveryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller responsável pelo fluxo de recuperação de senha.
 * Expõe endpoints para solicitar e redefinir senha.
 */
@RestController
@RequestMapping("/api/password")
public class PasswordRecoveryController {

    private final PasswordRecoveryService passwordRecoveryService;

    public PasswordRecoveryController(PasswordRecoveryService passwordRecoveryService) {
        this.passwordRecoveryService = passwordRecoveryService;
    }

    /**
     * Endpoint para solicitar a recuperação de senha.
     * Recebe o username e retorna o token de recuperação (em produção, envie por e-mail).
     */
    @PostMapping("/request-reset")
    public ResponseEntity<String> requestPasswordReset(@RequestParam String username) {
        return passwordRecoveryService.requestPasswordReset(username);
    }

    /**
     * Endpoint para redefinir a senha usando o token de recuperação.
     * Recebe o token e a nova senha.
     */
    @PostMapping("/reset")
    public ResponseEntity<Void> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        return passwordRecoveryService.resetPassword(token, newPassword);
    }
}