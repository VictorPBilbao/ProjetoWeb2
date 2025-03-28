package com.ufpr.byteassist_backend.repository;

import com.surrealdb.Response;
import com.surrealdb.Surreal;
import com.ufpr.byteassist_backend.model.User;

import com.ufpr.byteassist_backend.service.DatabaseService;

public class UserRepo {
    private final Surreal db;

    public UserRepo(DatabaseService databaseService) {
        this.db = databaseService.getDatabase();
    }

    public User getUserByUsername(String username, String password) {
        Response response = db
                .query("SELECT * FROM Users WHERE username = '" + username + "'");

        // WTF IS THIS?? NOT SURE HOW I MANAGED TO FIND IT
        // User user = response.take(0).getArray().get(0).get(User.class);
        try {
            return response.take(0).getArray().get(0).get(User.class);
        } catch (Exception e) {
            return null;
        }
    }

}
