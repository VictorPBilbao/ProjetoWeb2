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

@Repository
public class UserRepo implements UserRepoInterface {
    private final Surreal db;

    public UserRepo(DatabaseService databaseService) {
        this.db = databaseService.getDatabase();
    }

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

    public boolean isUsernameAvailable(String username) {
        Optional<User> user = getUser(username);
        // Retorna true se não existir usuário com o username informado
        return user.isEmpty();
    }

    public boolean isEmailAvailable(String email) {
        // Monta a query para buscar usuários com o e-mail informado
        String query = "SELECT * FROM User WHERE email = '%s';".formatted(email);
        Response response = db.query(query);

        // Verifica se a consulta retornou resultados (se não retornou, o e-mail está
        // disponível)
        return response.take(0).getArray().len() == 0;
    }

    public Optional<User> getUserByEmail(String email) {
        try {
            // Query para buscar usuário pelo email
            String query = "SELECT * FROM User WHERE email = '%s';".formatted(email);
            Response response = db.query(query);
            User user = response.take(0).getArray().get(0).get(User.class);
            if (user != null) {
                return Optional.ofNullable(user);
            }
            return Optional.empty();
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public Optional<DetailedUserDTO> getDetailedUser(String username) {
        System.out.println("Fetching detailed user for username: " + username);
        try {
            // Executa uma query que busca o usuário e faz o fetch da entidade person
            // associada
            Response response = db.queryBind(
                    "SELECT * FROM User WHERE id.id() = $user FETCH person",
                    Map.of("user", username));
            // Extrai o DTO detalhado do resultado da consulta
            DetailedUserDTO dto = response.take(0).getArray().get(0).get(DetailedUserDTO.class);
            System.out.println(dto); // Loga o DTO para depuração
            return Optional.ofNullable(dto);
        } catch (Exception e) {
            // Em caso de erro, retorna Optional vazio
            return Optional.empty();
        }
    }

    @Override
    public Optional<List<String>> getAllEmployees() {
        try {
            // Busca todos os funcionários no banco de dados
            Response response = db.query("select value id from User where role = 'Employee'");
            List<String> employees = new ArrayList<>();
            for (com.surrealdb.Value value : response.take(0).getArray()) {
                // value is already a string, how to convert it to String without adding double quotes again?
                employees.add(value.toString().replace("\'", ""));
            }
            return Optional.ofNullable(employees);
        } catch (Exception e) {
            // Em caso de erro, retorna Optional vazio
            return Optional.empty();
        }
    }
}
