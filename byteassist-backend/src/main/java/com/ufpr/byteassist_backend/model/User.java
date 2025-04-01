package com.ufpr.byteassist_backend.model;

import com.surrealdb.RecordId;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    // TODO: Alter to private after SurrealDB update
    public RecordId id;
    public String username;
    public String password;
}
