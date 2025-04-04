package com.ufpr.byteassist_backend.repository;

import org.springframework.stereotype.Repository;

import com.surrealdb.Surreal;

import com.ufpr.byteassist_backend.service.DatabaseService;

@Repository
public class UpdateTimeRepo {
    private final Surreal db;

    public UpdateTimeRepo(DatabaseService databaseService) {
        this.db = databaseService.getDatabase();
    }

    public void updateTimeLastLogin(String id) {
        try {
            db.query("UPDATE " + id + " SET time.last_login_at = time::now()");
        } catch (Exception e) {
            // Skip update
        }
    }

}
