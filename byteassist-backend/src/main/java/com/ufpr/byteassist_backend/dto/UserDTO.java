package com.ufpr.byteassist_backend.dto;

public class UserDTO {
    private String id;
    private String username;
    private String token;

    public UserDTO(String id, String username, String token) {
        this.id = id;
        this.username = username;
        this.token = token;
    }

    public String getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getToken() {
        return token;
    }
}