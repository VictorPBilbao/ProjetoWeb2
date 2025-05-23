package com.ufpr.byteassist_backend.repository;

import org.springframework.stereotype.Repository;

import com.surrealdb.Surreal;
import com.ufpr.byteassist_backend.service.DatabaseService;

@Repository
public class UpdateTimeRepo {

    // Instância do banco de dados SurrealDB
    private final Surreal db;

    /**
     * Construtor que inicializa o banco de dados a partir do serviço de banco de dados.
     * 
     * @param databaseService Serviço que fornece a instância do banco de dados.
     */
    public UpdateTimeRepo(DatabaseService databaseService) {
        this.db = databaseService.getDatabase();
    }

    public void updateTimeLastLogin(String id) {
        try {
            // Executa a consulta para atualizar o campo de última data de login
            String query = String.format("UPDATE %s SET time.last_login_at = time::now()", id);
            db.query(query);
        } catch (Exception e) {
            // Ignora a exceção caso ocorra algum erro durante a atualização
            System.err.println("Erro ao atualizar o último login para o ID: " + id);
        }
    }
}
