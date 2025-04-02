package com.ufpr.byteassist_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

@Data
@AllArgsConstructor
public class UserDTO {
    private String id;
    private String username;
    private ZonedDateTime createdAt;
    private ZonedDateTime lastLoginAt;
    private boolean active;
    private String token;

    public String getCreatedAt() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
        return createdAt.format(formatter);
    }

    public String getLastLoginAt() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
        return lastLoginAt.format(formatter);
    }
}