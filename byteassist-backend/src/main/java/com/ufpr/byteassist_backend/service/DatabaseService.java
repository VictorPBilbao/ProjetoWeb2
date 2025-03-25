package com.ufpr.byteassist_backend.service;

import com.surrealdb.Surreal;
import com.surrealdb.signin.Namespace;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

@Service
public class DatabaseService {

    private Surreal db;

    @PostConstruct
    public void initialize() {
        try {
            db = new Surreal();
            db.connect("wss://byteassist-database.fly.dev/");
            db.useNs("dev").useDb("public");
            db.signin(new Namespace("byteassist-user", "password", "dev"));
        } catch (Exception e) {
            throw new RuntimeException("Failed to connect to the database", e);
        }
    }

    public Surreal getDatabase() {
        return db;
    }

    @PreDestroy
    public void cleanup() {
        if (db != null) {
            try {
                db.close();
            } catch (Exception e) {
                System.err.println("Failed to close the database connection: " + e.getMessage());
            }
        }
    }
}
