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
        if (username == null || !username.matches("^\\w+$")) {
            // Optionally, you can log the invalid input here before returning null
            return null;
        }

        // ? Você pode enviar mais de uma query ao mesmo tempo, separando por ponto e
        // ? vírgula. O response é uma lista de respostas, por isso pegamos a primeira
        // ? resposta com response.take(0) e transformamos em um array com getArray() e
        // ? pegamos o primeiro elemento com get(0) caso necessário.
        try {
            Response response = db
                    .query("SELECT * FROM Users WHERE username = '" + username + "'");
            return response.take(0).getArray().get(0).get(User.class);
        } catch (Exception e) {
            return null;
        }
    }

}
