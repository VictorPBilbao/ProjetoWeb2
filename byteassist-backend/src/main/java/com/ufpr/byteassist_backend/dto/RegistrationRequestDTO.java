package com.ufpr.byteassist_backend.dto;

import lombok.Data;

@Data
public class RegistrationRequestDTO {
    private String username;
    private String password;
    private String email;
    private String zip;
    private String street;
    private String number;
    private String neighborhood;
    private String city;
    private String state;
    private String country;
}
