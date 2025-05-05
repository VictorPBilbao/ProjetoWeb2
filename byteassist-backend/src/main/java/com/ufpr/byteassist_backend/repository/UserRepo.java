package com.ufpr.byteassist_backend.repository;

import org.springframework.stereotype.Repository;

import com.surrealdb.RecordId;
import com.surrealdb.Response;
import com.surrealdb.Surreal;
import com.ufpr.byteassist_backend.model.Person;
import com.ufpr.byteassist_backend.model.User;

import com.ufpr.byteassist_backend.service.DatabaseService;

@Repository
public class UserRepo implements UserRepoInterface {
    private final Surreal db;

    public UserRepo(DatabaseService databaseService) {
        this.db = databaseService.getDatabase();
    }
    
    @Override
    public User getUser(String username) {
        return db.select(User.class, new RecordId("User", username))
                 .orElseThrow(() -> new RuntimeException("User not found for username: " + username));
    }
    
    @Override
    public User createUser(User user, String username) {
        return db.create(User.class, new RecordId("User", username), user);
    }
    
    @Override
    public void deleteUser(String username) {
        db.delete("User:" + username + ";");
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

    public void createUser(User user) {
        System.out.println("Creating user: " + user);
        db.create(User.class, new RecordId("User", user.getUsername()), user);
        System.out.println("User created successfully with ID: " + user.getId());
    }
}
