package com.ufpr.byteassist_backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.surrealdb.RecordId;
import com.ufpr.byteassist_backend.model.Person;
import com.ufpr.byteassist_backend.model.UserTime;
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
public class DetailedUserDTO {
    @Null(groups = ValidationGroups.Update.class, message = "ID must not be provided in update requests")
    public RecordId id;
    
    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Email should be valid")
    public String email;
    
    @Null(message = "Username must be null")
    public boolean isActive = true;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @NotBlank(groups = ValidationGroups.Create.class, message = "Password cannot be blank when creating a user")
    @Null(groups = ValidationGroups.Update.class, message = "Password must not be provided in update requests")
    public String password;
    
    @NotBlank(message = "person cannot be blank")
    public Person person;
    
    @Null(message = "Time must be null")
    public UserTime time;

    @Null(message = "Role must be null")
    public String role = "Client";
}
