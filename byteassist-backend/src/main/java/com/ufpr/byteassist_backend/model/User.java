package com.ufpr.byteassist_backend.model;

import com.surrealdb.RecordId;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    // TODO: Alter to private after SurrealDB update
    public RecordId id;
    public String username;
    public String password;
    public String first_name;
    public String last_name;
    public String email;
    public boolean is_active;
    public ZonedDateTime created_at;
    public ZonedDateTime last_login_at;
}
