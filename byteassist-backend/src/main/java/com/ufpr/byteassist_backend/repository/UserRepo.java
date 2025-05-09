package com.ufpr.byteassist_backend.repository;

import org.springframework.stereotype.Repository;

import com.surrealdb.RecordId;
import com.surrealdb.Response;
import com.surrealdb.Surreal;
import com.ufpr.byteassist_backend.model.User;
import com.ufpr.byteassist_backend.service.DatabaseService;

@Repository
public class UserRepo {

    // Instância do banco de dados SurrealDB
    private final Surreal db;

    // Construtor que inicializa o banco de dados a partir do serviço de banco de dados
    public UserRepo(DatabaseService databaseService) {
        this.db = databaseService.getDatabase();
    }

    /**
     * Busca um usuário pelo nome de usuário ou e-mail.
     * 
     * @param username Nome de usuário ou e-mail.
     * @return Objeto User se encontrado, ou null caso contrário.
     */
    public User getUserByUsername(String username) {
        String query = String.format(
                "SELECT *, id.id() AS username FROM User WHERE id.id() = '%s' OR email = '%s';",
                username, username);
        Response response = db.query(query);

        try {
            // Retorna o primeiro resultado da consulta como um objeto User
            return response.take(0).getArray().get(0).get(User.class);
        } catch (NullPointerException e) {
            // Retorna null se nenhum usuário for encontrado
            return null;
        }
    }

    /**
     * Verifica se um nome de usuário está disponível.
     * 
     * @param username Nome de usuário a ser verificado.
     * @return true se o nome de usuário estiver disponível, false caso contrário.
     */
    public boolean isUsernameAvailable(String username) {
        String query = String.format("SELECT * FROM User:%s;", username);
        Response response = db.query(query);

        // Verifica se a consulta retornou resultados
        return response.take(0).getArray().len() == 0;
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

    /**
     * Cria um novo usuário no banco de dados.
     * 
     * @param user Objeto User contendo os dados do novo usuário.
     */
    public void createUser(User user) {
        System.out.println("Criando usuário: " + user);

        // Cria um novo registro no banco de dados com o ID baseado no nome de usuário
        db.create(User.class, new RecordId("User", user.getUsername()), user);

        System.out.println("Usuário criado com sucesso com ID: " + user.getId());
    }
}
