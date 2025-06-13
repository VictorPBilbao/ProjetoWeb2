package com.ufpr.byteassist_backend.service;

import com.ufpr.byteassist_backend.model.PasswordResetToken;
import com.ufpr.byteassist_backend.model.User;
import com.ufpr.byteassist_backend.repository.PasswordResetTokenRepo;
import com.ufpr.byteassist_backend.repository.UserRepo;
import com.ufpr.byteassist_backend.exception.EnhancedStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.Optional;
import java.util.UUID;

/**
 * Serviço responsável pelo fluxo de recuperação de senha.
 * Gera tokens de recuperação, valida tokens e redefine senhas.
 */
@Service
public class PasswordRecoveryService {
    // Repositório de usuários
    private final UserRepo userRepo;
    // Repositório de tokens de recuperação de senha
    private final PasswordResetTokenRepo tokenRepo;
    // Encoder para criptografar senhas
    private final BCryptPasswordEncoder passwordEncoder;

    /**
     * Construtor com injeção de dependências.
     */
    public PasswordRecoveryService(UserRepo userRepo, PasswordResetTokenRepo tokenRepo) {
        this.userRepo = userRepo;
        this.tokenRepo = tokenRepo;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    /**
     * Solicita a recuperação de senha, gerando um token temporário.
     * @param username Nome de usuário para recuperação.
     * @return ResponseEntity com o token gerado.
     */
    public ResponseEntity<String> requestPasswordReset(String username) {
        Optional<User> user = userRepo.getUser(username);
        if (user.isEmpty()) {
            throw new EnhancedStatusException(HttpStatus.NOT_FOUND, "User not found", "No user with this username.");
        }
        // Gera token único e define expiração (1 hora)
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setUsername(username);
        resetToken.setToken(token);
        resetToken.setExpiration(ZonedDateTime.now().plusHours(1));
        tokenRepo.createToken(resetToken);

        // Em produção, envie o token por e-mail. Aqui, retorna o token na resposta.
        return ResponseEntity.ok(token);
    }

    /**
     * Redefine a senha do usuário usando o token de recuperação.
     * @param token Token de recuperação recebido.
     * @param newPassword Nova senha a ser definida.
     * @return ResponseEntity sem conteúdo em caso de sucesso.
     */
    public ResponseEntity<Void> resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> resetTokenOpt = tokenRepo.getToken(token);
        // Verifica se o token existe e está válido
        if (resetTokenOpt.isEmpty() || resetTokenOpt.get().getExpiration().isBefore(ZonedDateTime.now())) {
            throw new EnhancedStatusException(HttpStatus.BAD_REQUEST, "Invalid or expired token", "The password reset token is invalid or expired.");
        }
        String username = resetTokenOpt.get().getUsername();
        Optional<User> userOpt = userRepo.getUser(username);
        if (userOpt.isEmpty()) {
            throw new EnhancedStatusException(HttpStatus.NOT_FOUND, "User not found", "No user with this username.");
        }
        User user = userOpt.get();
        // Criptografa a nova senha e atualiza o usuário
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepo.updateUser(user, username);
        // Remove o token após uso
        tokenRepo.deleteToken(token);
        return ResponseEntity.noContent().build();
    }
}