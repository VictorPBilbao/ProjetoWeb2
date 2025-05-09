package com.ufpr.byteassist_backend.repository;

import org.springframework.stereotype.Repository;

import com.surrealdb.RecordId;
import com.surrealdb.Surreal;
import com.ufpr.byteassist_backend.model.Person;
import com.ufpr.byteassist_backend.service.DatabaseService;

@Repository
public class PersonRepo {

    // Instância do banco de dados SurrealDB
    private final Surreal db;

    /**
     * Construtor que inicializa o banco de dados a partir do serviço de banco de dados.
     * 
     * @param databaseService Serviço que fornece a instância do banco de dados.
     */
    public PersonRepo(DatabaseService databaseService) {
        this.db = databaseService.getDatabase();
    }

    /**
     * Cria um novo registro de pessoa no banco de dados.
     * 
     * @param person   Objeto Person contendo os dados da pessoa a ser criada.
     * @param username Nome de usuário associado à pessoa.
     * @return O ID do registro criado.
     */
    public RecordId createPerson(Person person, String username) {
        // Log para indicar o início do processo de criação
        System.out.println("Iniciando a criação de uma pessoa com o nome de usuário: " + username);
        System.out.println("Detalhes da pessoa: " + person);

        // Cria o registro no banco de dados com o ID baseado no nome de usuário
        Person created = db.create(Person.class, new RecordId("Person", username), person);

        // Log para indicar o sucesso da criação
        System.out.println("Pessoa criada com sucesso com ID: " + created.getId());

        // Retorna o ID do registro criado
        return created.getId();
    }
}
