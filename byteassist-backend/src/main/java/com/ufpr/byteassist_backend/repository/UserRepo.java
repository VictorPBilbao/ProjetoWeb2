package com.ufpr.byteassist_backend.repository;

import org.springframework.stereotype.Repository;

import com.surrealdb.Response;
import com.surrealdb.Surreal;
import com.ufpr.byteassist_backend.model.User;

import com.ufpr.byteassist_backend.service.DatabaseService;

@Repository
public class UserRepo {
    private final Surreal db;

    public UserRepo(DatabaseService databaseService) {
        this.db = databaseService.getDatabase();
    }

    public User getUserByUsername(String username) {
        Response response = db
                .query("SELECT *, id.id() AS username FROM User WHERE id.id() = '" + username + "' OR email = '"
                        + username + "';");
        try {
            return response.take(0).getArray().get(0).get(User.class);
        } catch (NullPointerException e) {
            return null;
        }
    }

    public boolean isUsernameAvailable(String username) {
        Response response = db.query("SELECT * FROM User:" + username + ";");
        return response.take(0).getArray().len() == 0;
    }

    public boolean isEmailAvailable(String email) {
        Response response = db.query("SELECT * FROM User WHERE email = '" + email + "';");
        return response.take(0).getArray().len() == 0;
    }

}
