package com.ufpr.byteassist_backend.repository;

import com.surrealdb.Surreal;
import com.surrealdb.RecordId;
import com.ufpr.byteassist_backend.model.PasswordResetToken;
import com.ufpr.byteassist_backend.service.DatabaseService;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositório responsável pelas operações de persistência relacionadas ao token de recuperação de senha.
 * Permite criar, buscar e remover tokens no banco de dados.
 */
@Repository // Indica que esta classe é um componente de repositório do Spring
public class PasswordResetTokenRepo {
    // Instância do banco de dados SurrealDB utilizada para as operações
    private final Surreal db;

    /**
     * Construtor que recebe o serviço de banco de dados e inicializa a instância do SurrealDB.
     * @param databaseService Serviço que fornece a instância do banco de dados.
     */
    public PasswordResetTokenRepo(DatabaseService databaseService) {
        this.db = databaseService.getDatabase();
    }

    /**
     * Busca um token de recuperação de senha pelo valor do token.
     * @param token Valor do token a ser buscado.
     * @return Optional contendo o token encontrado, ou vazio se não encontrado.
     */
    public Optional<PasswordResetToken> getToken(String token) {
        try {
            // Realiza a busca no banco de dados pelo token informado
            return db.select(PasswordResetToken.class, new RecordId("PasswordResetToken", token));
        } catch (Exception e) {
            // Em caso de erro, retorna Optional vazio
            return Optional.empty();
        }
    }

    /**
     * Cria e armazena um novo token de recuperação de senha no banco de dados.
     * @param token Objeto PasswordResetToken a ser criado.
     * @return Optional contendo o token criado, ou vazio em caso de erro.
     */
    public Optional<PasswordResetToken> createToken(PasswordResetToken token) {
        try {
            // Cria o registro no banco de dados com o ID baseado no valor do token
            return Optional.ofNullable(db.create(PasswordResetToken.class, new RecordId("PasswordResetToken", token.getToken()), token));
        } catch (Exception e) {
            // Em caso de erro, retorna Optional vazio
            return Optional.empty();
        }
    }

    /**
     * Remove um token de recuperação de senha do banco de dados pelo valor do token.
     * @param token Valor do token a ser removido.
     */
    public void deleteToken(String token) {
        // Remove o registro do token do banco de dados
        db.delete(new RecordId("PasswordResetToken", token));
    }
}