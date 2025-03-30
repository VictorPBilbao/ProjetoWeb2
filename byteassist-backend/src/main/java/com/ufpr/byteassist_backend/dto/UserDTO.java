package com.ufpr.byteassist_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserDTO {
    private String id;
    private String username;
    private String token;
}