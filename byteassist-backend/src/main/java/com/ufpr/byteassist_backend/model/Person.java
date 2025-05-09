package com.ufpr.byteassist_backend.model;

import java.time.ZonedDateTime;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.surrealdb.RecordId;
import com.ufpr.byteassist_backend.serializer.RecordIdDeserializer;
import com.ufpr.byteassist_backend.serializer.RecordIdSerializer;
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
    @JsonSerialize(using = RecordIdSerializer.class)
    @JsonDeserialize(using = RecordIdDeserializer.class)
    @Null(message = "ID should not be provided in the request body, use the URL instead")
    public RecordId id;
    
    @NotBlank(message = "CPF is required", groups = {ValidationGroups.Create.class, ValidationGroups.Update.class})
    @Pattern(regexp = "\\d{11}", message = "CPF must contain exactly 11 digits", groups = {ValidationGroups.Create.class, ValidationGroups.Update.class})
    public String cpf;
    
    @NotNull
    @Past(message = "Date of birth must be in the past")
    @JsonDeserialize(using = SimpleDateDeserializer.class)
    public ZonedDateTime dob;
    
    @NotBlank
    @Pattern(regexp = "^(Male|Female|Other)$", message = "Gender must be 'Male', 'Female', or 'Other'")
    public String gender;
    
    @NotNull
    @Valid
    public PersonAddress address;
    
    @NotNull 
    @Valid
    public PersonName name;
}