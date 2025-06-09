package com.ufpr.byteassist_backend.model;

import java.time.ZonedDateTime;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.surrealdb.RecordId;
import com.ufpr.byteassist_backend.serializer.SimpleDateDeserializer;
import com.ufpr.byteassist_backend.validation.ValidationGroups;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Null;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Person {
    @Null(message = "ID should not be provided in the request body, use the URL instead")
    private RecordId id;
    
    @NotBlank(message = "CPF is required", groups = {ValidationGroups.Create.class})
    @Pattern(regexp = "\\d{11}", message = "CPF must contain exactly 11 digits", groups = {ValidationGroups.Create.class, ValidationGroups.Update.class})
    private String cpf;
    
    @NotNull(groups = {ValidationGroups.Create.class})
    @Past(message = "Date of birth must be in the past")
    @JsonDeserialize(using = SimpleDateDeserializer.class)
    private ZonedDateTime dob;
    
    @NotBlank(groups = {ValidationGroups.Create.class})
    @Pattern(regexp = "^(Male|Female|Other)$", message = "Gender must be 'Male', 'Female', or 'Other'", groups = {ValidationGroups.Create.class, ValidationGroups.Update.class})
    private String gender;
    
    @NotBlank(groups = {ValidationGroups.Create.class})
    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Phone number must be between 10 and 15 digits, optionally starting with '+'")
    private String phone; // mandatory when creating a person
    
    @NotNull(groups = {ValidationGroups.Create.class})
    @Valid
    private PersonAddress address;
    
    @NotNull(groups = {ValidationGroups.Create.class}) 
    @Valid
    private PersonName name;
}