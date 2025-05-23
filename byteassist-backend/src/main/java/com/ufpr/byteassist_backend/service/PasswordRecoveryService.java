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

@Service
public class PasswordRecoveryService {
    private final UserRepo userRepo;
    private final PasswordResetTokenRepo tokenRepo;
    private final BCryptPasswordEncoder passwordEncoder;

    public PasswordRecoveryService(UserRepo userRepo, PasswordResetTokenRepo tokenRepo) {
        this.userRepo = userRepo;
        this.tokenRepo = tokenRepo;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    // Solicita a recuperação de senha (gera token)
    public ResponseEntity<String> requestPasswordReset(String username) {
        Optional<User> user = userRepo.getUser(username);
        if (user.isEmpty()) {
            throw new EnhancedStatusException(HttpStatus.NOT_FOUND, "User not found", "No user with this username.");
        }
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setUsername(username);
        resetToken.setToken(token);
        resetToken.setExpiration(ZonedDateTime.now().plusHours(1)); // Token válido por 1 hora
        tokenRepo.createToken(resetToken);

        // Aqui você pode enviar o token por e-mail. Por enquanto, retorna o token na resposta.
        return ResponseEntity.ok(token);
    }

    // Redefine a senha usando o token
    public ResponseEntity<Void> resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> resetTokenOpt = tokenRepo.getToken(token);
        if (resetTokenOpt.isEmpty() || resetTokenOpt.get().getExpiration().isBefore(ZonedDateTime.now())) {
            throw new EnhancedStatusException(HttpStatus.BAD_REQUEST, "Invalid or expired token", "The password reset token is invalid or expired.");
        }
        String username = resetTokenOpt.get().getUsername();
        Optional<User> userOpt = userRepo.getUser(username);
        if (userOpt.isEmpty()) {
            throw new EnhancedStatusException(HttpStatus.NOT_FOUND, "User not found", "No user with this username.");
        }
        User user = userOpt.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepo.updateUser(user, username);
        tokenRepo.deleteToken(token);
        return ResponseEntity.noContent().build();
    }
}