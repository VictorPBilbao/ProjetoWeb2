package com.ufpr.byteassist_backend.dto;

import com.ufpr.byteassist_backend.model.Person;
import com.ufpr.byteassist_backend.model.User;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegistrationRequestDTO {

    @NotNull
    @Valid
    private Person person;

    @NotNull
    @Valid
    private User user;
}