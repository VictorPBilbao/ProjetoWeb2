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
        // TODO : Alterar para queryBind após atualização do SurrealDB
        if (username == null || !username.matches("^[\\w@.-]+$")) {
            return null;
        }

        // ? Você pode enviar mais de uma query ao mesmo tempo, separando por ponto e
        // ? vírgula. O response é uma lista de respostas, por isso pegamos a primeira
        // ? resposta com response.take(0) e transformamos em um array com getArray() e
        // ? pegamos o primeiro elemento com get(0) caso necessário.
        Response response = db
                .query("SELECT *, id.id() AS username FROM User WHERE id.id() = '" + username + "' OR email = '"
                        + username + "';");
        return response.take(0).getArray().get(0).get(User.class);
    }

    public boolean isUsernameAvailable(String username) {
        System.out.println("Checking if username is available: " + username);
        System.out.println();
        Response response = db.query("SELECT * FROM User:" + username + ";");
        return response.take(0).getArray().len() == 0;
    }

    public boolean isEmailAvailable(String email) {
        System.out.println("Checking if email is available: " + email);
        System.out.println();
        Response response = db.query("SELECT * FROM User WHERE email = '" + email + "';");
        return response.take(0).getArray().len() == 0;
    }

}
