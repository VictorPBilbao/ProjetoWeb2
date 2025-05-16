package com.ufpr.byteassist_backend.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.surrealdb.RecordId;
import com.ufpr.byteassist_backend.validation.ValidationGroups;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Null;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Null(groups = ValidationGroups.Update.class, message = "ID must not be provided in update requests")
    private RecordId id;
    
    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Email should be valid")
    private String email;

    private boolean isActive = true;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @NotBlank(groups = ValidationGroups.Create.class, message = "Password cannot be blank when creating a user")
    @Null(groups = ValidationGroups.Update.class, message = "Password must not be provided in update requests")
    private String password;

    @Null(message = "Person ID must be null")
    private RecordId person;
    
    private UserTime time;

    @NotBlank(message = "Type cannot be blank")
    @jakarta.validation.constraints.Pattern(regexp = "^(Client|Admin)$", message = "Type must be either 'Client' or 'Admin'")
    private String role = "Client";
}