package com.ufpr.byteassist_backend.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.surrealdb.RecordId;
import com.ufpr.byteassist_backend.serializer.RecordIdDeserializer;
import com.ufpr.byteassist_backend.serializer.RecordIdSerializer;
import com.ufpr.byteassist_backend.validation.ValidationGroups;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Null;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @JsonSerialize(using = RecordIdSerializer.class)
    @JsonDeserialize(using = RecordIdDeserializer.class)
    @Null(groups = ValidationGroups.Update.class, message = "ID must not be provided in update requests")
    public RecordId id;
    
    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Email should be valid")
    public String email;

    public boolean isActive;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @NotBlank(groups = ValidationGroups.Create.class, message = "Password cannot be blank when creating a user")
    public String password;

    @JsonSerialize(using = RecordIdSerializer.class)
    @JsonDeserialize(using = RecordIdDeserializer.class)
    @NotNull(message = "Person ID cannot be null")
    public RecordId person;
    
    public UserTime time;

    @NotBlank(message = "Type cannot be blank")
    @jakarta.validation.constraints.Pattern(regexp = "^(Client|Admin)$", message = "Type must be either 'Client' or 'Admin'")
    public String role = "Client";
}