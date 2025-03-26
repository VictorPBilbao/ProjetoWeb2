package com.ufpr.byteassist_backend.service;

import com.surrealdb.Surreal;
import com.surrealdb.signin.Database;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

@Service
public class DatabaseService {

    private Surreal db;

    @PostConstruct
    public void initialize() {
        try {
            Dotenv dotenv = Dotenv.load();
            String url = dotenv.get("DATABASE_URL");
            String namespace = dotenv.get("DATABASE_NAMESPACE");
            String dbName = dotenv.get("DATABASE_NAME");
            String user = dotenv.get("DATABASE_USER");
            String password = dotenv.get("DATABASE_PASSWORD");

            db = new Surreal();
            db.connect(url);
            db.useNs(namespace).useDb(dbName);
            db.signin(new Database(user, password, namespace, dbName));

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
