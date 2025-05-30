package com.ufpr.byteassist_backend.model;

import java.time.ZonedDateTime;

/**
 * Classe que representa um token de recuperação de senha.
 * Utilizada para armazenar as informações necessárias para o processo de reset de senha,
 * incluindo o usuário associado, o token gerado e a data de expiração do token.
 */
public class PasswordResetToken {
    // Nome de usuário associado ao token de recuperação
    private String username;
    // Token único gerado para permitir a redefinição de senha
    private String token;
    // Data e hora de expiração do token (após esse horário, o token não é mais válido)
    private ZonedDateTime expiration;

    // Métodos getters e setters para acessar e modificar os atributos privados

    /**
     * Retorna o nome de usuário associado ao token.
     */
    public String getUsername() { return username; }

    /**
     * Define o nome de usuário associado ao token.
     */
    public void setUsername(String username) { this.username = username; }

    /**
     * Retorna o valor do token de recuperação.
     */
    public String getToken() { return token; }

    /**
     * Define o valor do token de recuperação.
     */
    public void setToken(String token) { this.token = token; }

    /**
     * Retorna a data e hora de expiração do token.
     */
    public ZonedDateTime getExpiration() { return expiration; }

    /**
     * Define a data e hora de expiração do token.
     */
    public void setExpiration(ZonedDateTime expiration) { this.expiration = expiration; }
}