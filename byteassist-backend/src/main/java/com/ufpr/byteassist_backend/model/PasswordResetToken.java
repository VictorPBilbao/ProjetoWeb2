package com.ufpr.byteassist_backend.model;

import java.time.ZonedDateTime;

public class PasswordResetToken {
    private String username;
    private String token;
    private ZonedDateTime expiration;

    // Getters e setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public ZonedDateTime getExpiration() { return expiration; }
    public void setExpiration(ZonedDateTime expiration) { this.expiration = expiration; }
}