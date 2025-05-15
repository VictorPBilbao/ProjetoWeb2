package com.ufpr.byteassist_backend.repository;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.surrealdb.RecordId;
import com.surrealdb.Response;
import com.surrealdb.Surreal;
import com.surrealdb.UpType;
import com.ufpr.byteassist_backend.model.User;
import com.ufpr.byteassist_backend.model.UserTime;

import java.time.ZonedDateTime;

import com.ufpr.byteassist_backend.service.DatabaseService;

@Repository
public class UserRepo implements UserRepoInterface {
    private final Surreal db;

    // Construtor que inicializa o banco de dados a partir do serviço de banco de dados
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
        user.setPerson(new RecordId("Person", username));
        try {
            return Optional.ofNullable(db.create(User.class, new RecordId("User", username), user));
        } catch (Exception e) {
            return Optional.empty();
        }
    }
    
    @Override
    public Optional<User> updateUser(User user, String username) {
        user.setTime(new UserTime());
        user.getTime().setUpdatedAt(ZonedDateTime.now());
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
    public Optional<List<User>> getAllUsers() {
        try {
            Iterator<User> users = db.select(User.class, "User");
            List<User> userList = new ArrayList<>();
            users.forEachRemaining(userList::add);
            return Optional.ofNullable(userList);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public boolean isUsernameAvailable(String username) {
        Optional<User> user = getUser(username);
        return user.isEmpty();
    }

    public boolean isEmailAvailable(String email) {
        String query = String.format("SELECT * FROM User WHERE email = '%s';", email);
        Response response = db.query(query);

        // Verifica se a consulta retornou resultados
        return response.take(0).getArray().len() == 0;
    }
}
