package com.ufpr.byteassist_backend.dto;

public class UserDTO {
    private String id;
    private String username;

    public UserDTO(String id, String username) {
        this.id = id;
        this.username = username;
    }

    public String getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }
}