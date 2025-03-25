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
        System.out.println("Connecting to database...");
        try {
            db = new Surreal();
            db.connect("wss://java-db-06askd6f4ps5n7ve0cltelvua8.aws-use1.surreal.cloud");
            db.useNs("main").useDb("main");
            db.signin(new Namespace("byteassist-test-user", "password", "main"));
            System.out.println("Connected to the database");
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
