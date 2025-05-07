package com.ufpr.byteassist_backend.repository;

import java.util.Iterator;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.surrealdb.RecordId;
import com.surrealdb.Response;
import com.surrealdb.Surreal;
import com.surrealdb.UpType;
import com.ufpr.byteassist_backend.model.User;

import com.ufpr.byteassist_backend.service.DatabaseService;

@Repository
public class UserRepo implements UserRepoInterface {
    private final Surreal db;

    public UserRepo(DatabaseService databaseService) {
        this.db = databaseService.getDatabase();
    }
    
    @Override
    public Optional<User> getUser(String username) {
        try {
            return db.select(User.class, new RecordId("User", username));
        } catch (Exception e) {
            return Optional.empty();
        }
    }
    
    @Override
    public Optional<User> createUser(User user, String username) {
        try {
            System.out.println("Creating user: " + user);
            return Optional.ofNullable(db.create(User.class, new RecordId("User", username), user));
        } catch (Exception e) {
            return Optional.empty();
        }
    }
    
    @Override
    public Optional<User> updateUser(User user, String username) {
        try {
            return Optional.ofNullable(db.update(User.class, new RecordId("User", username), UpType.MERGE, user));
        } catch (Exception e) {
            return Optional.empty();
        }
    }
    
    @Override
    public Boolean deleteUser(String username) {
        try {
            db.delete(new RecordId("User", username));
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    
    @Override
    public Optional<Iterator<User>> getAllUsers() {
        try {
            Iterator<User> users = db.select(User.class, "User");
            return Optional.ofNullable(users);
        } catch (Exception e) {
            return Optional.empty();
        }
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
