package com.ufpr.byteassist_backend.repository;

import java.util.Iterator;
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
    public Optional<Iterator<User>> getAllUsers() {
        try {
            Iterator<User> users = db.select(User.class, "User");
            return Optional.ofNullable(users);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    /**
     * Verifica se um nome de usuário está disponível.
     * 
     * @param username Nome de usuário a ser verificado.
     * @return true se o nome de usuário estiver disponível, false caso contrário.
     */
    public boolean isUsernameAvailable(String username) {
        Optional<User> user = getUser(username);
        return user.isEmpty();
    }

    /**
     * Verifica se um e-mail está disponível.
     * 
     * @param email E-mail a ser verificado.
     * @return true se o e-mail estiver disponível, false caso contrário.
     */
    public boolean isEmailAvailable(String email) {
        String query = String.format("SELECT * FROM User WHERE email = '%s';", email);
        Response response = db.query(query);

        // Verifica se a consulta retornou resultados
        return response.take(0).getArray().len() == 0;
    }
}
