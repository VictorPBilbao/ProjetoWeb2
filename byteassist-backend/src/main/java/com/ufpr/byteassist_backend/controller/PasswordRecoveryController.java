package com.ufpr.byteassist_backend.controller;

import com.ufpr.byteassist_backend.service.PasswordRecoveryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller responsável pelo fluxo de recuperação de senha.
 * Expõe endpoints para solicitar e redefinir senha.
 */
@RestController // Indica que esta classe é um controller REST do Spring
@RequestMapping("/api/password") // Define o prefixo dos endpoints deste controller
public class PasswordRecoveryController {

    // Injeta o serviço responsável pela lógica de recuperação de senha
    private final PasswordRecoveryService passwordRecoveryService;

    /**
     * Construtor que recebe o serviço de recuperação de senha via injeção de dependência.
     * @param passwordRecoveryService Serviço de recuperação de senha
     */
    public PasswordRecoveryController(PasswordRecoveryService passwordRecoveryService) {
        this.passwordRecoveryService = passwordRecoveryService;
    }

    /**
     * Endpoint para solicitar a recuperação de senha.
     * Recebe o username como parâmetro e retorna o token de recuperação.
     * Em produção, o token deve ser enviado por e-mail ao usuário.
     *
     * @param username Nome de usuário para o qual será gerado o token de recuperação
     * @return ResponseEntity contendo o token de recuperação
     */
    @PostMapping("/request-reset")
    public ResponseEntity<String> requestPasswordReset(@RequestParam String username) {
        // Chama o serviço para gerar e retornar o token de recuperação de senha
        return passwordRecoveryService.requestPasswordReset(username);
    }

    /**
     * Endpoint para redefinir a senha usando o token de recuperação.
     * Recebe o token e a nova senha como parâmetros.
     *
     * @param token Token de recuperação de senha recebido pelo usuário
     * @param newPassword Nova senha a ser definida
     * @return ResponseEntity sem conteúdo (HTTP 204) em caso de sucesso
     */
    @PostMapping("/reset")
    public ResponseEntity<Void> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        // Chama o serviço para validar o token e atualizar a senha do usuário
        return passwordRecoveryService.resetPassword(token, newPassword);
    }
}