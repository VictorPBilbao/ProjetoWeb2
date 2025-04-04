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
    private boolean active;
    private ZonedDateTime lastLoginAt;
    private String token;

    public String getLastLoginAt() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
        return lastLoginAt.format(formatter);
    }
}