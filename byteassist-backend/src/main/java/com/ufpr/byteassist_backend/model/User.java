package com.ufpr.byteassist_backend.model;

import com.surrealdb.RecordId;

public class User {
    public RecordId id;
    public String password;
    public String username;

    public User() {
    }

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}