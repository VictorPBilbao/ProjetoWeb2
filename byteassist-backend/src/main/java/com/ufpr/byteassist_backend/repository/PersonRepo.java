package com.ufpr.byteassist_backend.repository;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.surrealdb.RecordId;
import com.surrealdb.Surreal;
import com.surrealdb.UpType;
import com.ufpr.byteassist_backend.model.Person;
import com.ufpr.byteassist_backend.service.DatabaseService;

/**
 * Repositório responsável por operações de persistência relacionadas à entidade Person.
 * Implementa a interface PersonRepoInterface.
 */
@Repository
public class PersonRepo implements PersonRepoInterface {
    // Instância do banco de dados SurrealDB utilizada para as operações
    private final Surreal db;

    /**
     * Construtor que recebe o serviço de banco de dados e inicializa a instância do SurrealDB.
     * @param databaseService Serviço que fornece a instância do banco de dados.
     */
    public PersonRepo(DatabaseService databaseService) {
        this.db = databaseService.getDatabase();
    }
    
    /**
     * Busca uma pessoa pelo username.
     * @param username Nome de usuário da pessoa.
     * @return Optional contendo a pessoa encontrada, ou vazio se não encontrada.
     */
    @Override
    public Optional<Person> getPerson(String username) {
        try {
            // Realiza a busca no banco de dados pelo username informado
            return db.select(Person.class, new RecordId("Person", username));
        } catch (Exception e) {
            // Em caso de erro, retorna Optional vazio
            return Optional.empty();
        }
    }
    
    /**
     * Cria um novo registro de pessoa no banco de dados.
     * @param person Objeto Person a ser criado.
     * @param username Nome de usuário associado à pessoa.
     * @return Optional contendo a pessoa criada, ou vazio em caso de erro.
     */
    @Override
    public Optional<Person> createPerson(Person person, String username) {
        try {
            // Cria o registro no banco de dados com o ID baseado no username
            return Optional.ofNullable(db.create(Person.class, new RecordId("Person", username), person));
        } catch (Exception e) {
            // Em caso de erro, imprime o erro no console e retorna Optional vazio
            System.err.println("Error creating person: " + e.getMessage());
            e.printStackTrace(); // Exibe o stack trace para facilitar o debug
            return Optional.empty();
        }
    }

    /**
     * Atualiza os dados de uma pessoa existente no banco de dados.
     * @param person Objeto Person com os dados atualizados.
     * @param username Nome de usuário da pessoa a ser atualizada.
     * @return Optional contendo a pessoa atualizada, ou vazio em caso de erro.
     */
    @Override
    public Optional<Person> updatePerson(Person person, String username) {
        try {
            // Atualiza apenas os campos fornecidos (MERGE) no registro da pessoa
            return Optional.ofNullable(db.update(Person.class, new RecordId("Person", username), UpType.MERGE, person));
        } catch (Exception e) {
            // Em caso de erro, retorna Optional vazio
            return Optional.empty();
        }
    }
    
    /**
     * Remove uma pessoa do banco de dados pelo username.
     * @param username Nome de usuário da pessoa a ser removida.
     * @return true se a exclusão foi bem-sucedida, false caso contrário.
     */
    @Override
    public Boolean deletePerson(String username) {
        try {
            // Remove o registro da pessoa do banco de dados
            db.delete(new RecordId("Person", username));
            return true;
        } catch (Exception e) {
            // Em caso de erro, retorna false
            return false;
        }
    }
    
    /**
     * Recupera todas as pessoas cadastradas no banco de dados.
     * @return Optional contendo a lista de pessoas, ou vazio em caso de erro.
     */
    @Override
    public Optional<List<Person>> getAllPersons() {
        try {
            // Busca todos os registros da entidade Person
            Iterator<Person> persons = db.select(Person.class, "Person");
            List<Person> personList = new ArrayList<>();
            // Adiciona cada pessoa encontrada à lista
            persons.forEachRemaining(personList::add);
            return Optional.ofNullable(personList);
        } catch (Exception e) {
            // Em caso de erro, retorna Optional vazio
            return Optional.empty();
        }
    }
}