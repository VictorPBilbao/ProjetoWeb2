package com.ufpr.byteassist_backend.repository;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.surrealdb.RecordId;
import com.surrealdb.Response;
import com.surrealdb.Surreal;
import com.surrealdb.UpType;
import com.ufpr.byteassist_backend.dto.DetailedUserDTO;
import com.ufpr.byteassist_backend.model.User;
import com.ufpr.byteassist_backend.model.UserTime;
import com.ufpr.byteassist_backend.service.DatabaseService;

/**
 * Repositório responsável por operações de persistência relacionadas à entidade User.
 * Implementa a interface UserRepoInterface.
 */
@Repository
public class UserRepo implements UserRepoInterface {
    // Instância do banco de dados SurrealDB utilizada para as operações
    private final Surreal db;

    /**
     * Construtor que recebe o serviço de banco de dados e inicializa a instância do SurrealDB.
     * @param databaseService Serviço que fornece a instância do banco de dados.
     */
    public UserRepo(DatabaseService databaseService) {
        this.db = databaseService.getDatabase();
    }
    
    /**
     * Busca um usuário pelo username.
     * @param username Nome de usuário do usuário.
     * @return Optional contendo o usuário encontrado, ou vazio se não encontrado.
     */
    @Override
    public Optional<User> getUser(String username) {
        try {
            // Realiza a busca no banco de dados pelo username informado
            return db.select(User.class, new RecordId("User", username));
        } catch (Exception e) {
            // Em caso de erro, retorna Optional vazio
            return Optional.empty();
        }
    }
    
    /**
     * Cria um novo registro de usuário no banco de dados.
     * @param user Objeto User a ser criado.
     * @param username Nome de usuário associado ao usuário.
     * @return Optional contendo o usuário criado, ou vazio em caso de erro.
     */
    @Override
    public Optional<User> createUser(User user, String username) {
        // Define a referência à entidade Person relacionada ao usuário
        user.setPerson(new RecordId("Person", username));
        try {
            // Cria o registro no banco de dados com o ID baseado no username
            return Optional.ofNullable(db.create(User.class, new RecordId("User", username), user));
        } catch (Exception e) {
            // Em caso de erro, retorna Optional vazio
            return Optional.empty();
        }
    }
    
    /**
     * Atualiza os dados de um usuário existente no banco de dados.
     * @param user Objeto User com os dados atualizados.
     * @param username Nome de usuário do usuário a ser atualizado.
     * @return Optional contendo o usuário atualizado, ou vazio em caso de erro.
     */
    @Override
    public Optional<User> updateUser(User user, String username) {
        // Atualiza o campo de tempo do usuário para o momento atual
        user.setTime(new UserTime());
        user.getTime().setUpdatedAt(ZonedDateTime.now());
        try {
            // Atualiza apenas os campos fornecidos (MERGE) no registro do usuário
            return Optional.ofNullable(db.update(User.class, new RecordId("User", username), UpType.MERGE, user));
        } catch (Exception e) {
            // Em caso de erro, retorna Optional vazio
            return Optional.empty();
        }
    }
    
    /**
     * Remove um usuário do banco de dados pelo username.
     * @param username Nome de usuário do usuário a ser removido.
     * @return true se a exclusão foi bem-sucedida, false caso contrário.
     */
    @Override
    public Boolean deleteUser(String username) {
        try {
            // Remove o registro do usuário do banco de dados
            db.delete(new RecordId("User", username));
            return true;
        } catch (Exception e) {
            // Em caso de erro, retorna false
            return false;
        }
    }
    
    /**
     * Recupera todos os usuários cadastrados no banco de dados.
     * @return Optional contendo a lista de usuários, ou vazio em caso de erro.
     */
    @Override
    public Optional<List<User>> getAllUsers() {
        try {
            // Busca todos os registros da entidade User
            Iterator<User> users = db.select(User.class, "User");
            List<User> userList = new ArrayList<>();
            // Adiciona cada usuário encontrado à lista
            users.forEachRemaining(userList::add);
            return Optional.ofNullable(userList);
        } catch (Exception e) {
            // Em caso de erro, retorna Optional vazio
            return Optional.empty();
        }
    }

    /**
     * Verifica se um nome de usuário está disponível.
     * @param username Nome de usuário a ser verificado.
     * @return true se o nome de usuário estiver disponível, false caso contrário.
     */
    public boolean isUsernameAvailable(String username) {
        Optional<User> user = getUser(username);
        // Retorna true se não existir usuário com o username informado
        return user.isEmpty();
    }

    /**
     * Verifica se um e-mail está disponível.
     * @param email E-mail a ser verificado.
     * @return true se o e-mail estiver disponível, false caso contrário.
     */
    public boolean isEmailAvailable(String email) {
        // Monta a query para buscar usuários com o e-mail informado
        String query = String.format("SELECT * FROM User WHERE email = '%s';", email);
        Response response = db.query(query);

        // Verifica se a consulta retornou resultados (se não retornou, o e-mail está disponível)
        return response.take(0).getArray().len() == 0;
    }
    
    /**
     * Busca um usuário detalhado (incluindo informações da pessoa associada) pelo username.
     * @param username Nome de usuário do usuário.
     * @return Optional contendo o DTO detalhado do usuário, ou vazio em caso de erro.
     */
    public Optional<DetailedUserDTO> getDetailedUser(String username) {
        System.out.println("Fetching detailed user for username: " + username);
        try {
            // Executa uma query que busca o usuário e faz o fetch da entidade person associada
            Response response = db.queryBind(
                "SELECT * FROM User WHERE id.id() = $user FETCH person", 
                Map.of("user", username)
            );
            // Extrai o DTO detalhado do resultado da consulta
            DetailedUserDTO dto = response.take(0).getArray().get(0).get(DetailedUserDTO.class);
            System.out.println(dto); // Loga o DTO para depuração
            return Optional.ofNullable(dto);
        } catch (Exception e) {
            // Em caso de erro, retorna Optional vazio
            return Optional.empty();
        }
    }
}
