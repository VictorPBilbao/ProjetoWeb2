package com.ufpr.byteassist_backend.repository;

import com.surrealdb.Surreal;
import com.surrealdb.RecordId;
import com.ufpr.byteassist_backend.model.PasswordResetToken;
import com.ufpr.byteassist_backend.service.DatabaseService;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class PasswordResetTokenRepo {
    private final Surreal db;

    public PasswordResetTokenRepo(DatabaseService databaseService) {
        this.db = databaseService.getDatabase();
    }

    public Optional<PasswordResetToken> getToken(String token) {
        try {
            return db.select(PasswordResetToken.class, new RecordId("PasswordResetToken", token));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public Optional<PasswordResetToken> createToken(PasswordResetToken token) {
        try {
            return Optional.ofNullable(db.create(PasswordResetToken.class, new RecordId("PasswordResetToken", token.getToken()), token));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public void deleteToken(String token) {
        db.delete(new RecordId("PasswordResetToken", token));
    }
}