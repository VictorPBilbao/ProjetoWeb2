package com.ufpr.byteassist_backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.surrealdb.RecordId;
import com.ufpr.byteassist_backend.model.Person;
import com.ufpr.byteassist_backend.model.UserTime;
import com.ufpr.byteassist_backend.validation.ValidationGroups;

import jakarta.validation.Valid;
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
public class DetailedUserDTO {
    @Null(message = "Do not provide an ID as it will be generated automatically")
    public RecordId id;
    
    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Email should be valid")
    public String email;
    
    public boolean isActive = true;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @NotBlank(groups = ValidationGroups.Create.class, message = "Password cannot be blank when creating a user")
    @Null(groups = ValidationGroups.Update.class, message = "Password must not be provided in update requests")
    public String password;
    
    @NotNull(message = "Person cannot be null")
    @Valid
    public Person person;
    
    @Null(message = "Time must be null as it will be generated automatically")
    public UserTime time;

    public String role = "Client";
}
