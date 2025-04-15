package com.ufpr.byteassist_backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegistrationRequestDTO {
    @NotBlank(message = "Username is required")
    @Pattern(regexp = "^[a-z0-9._-]+$", message = "Username must be lowercase and can only contain letters, numbers, dots, underscores, and hyphens")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    @NotBlank(message = "Email is required")
    @Email(message = "Must be a valid email address")
    private String email;

    @NotBlank(message = "Zip code is required")
    @Pattern(regexp = "^\\d{5}-\\d{3}$", message = "Zip code must be in the format XXXXX-XXX")
    private String zip;

    @NotBlank(message = "Street is required")
    private String street;

    @NotBlank(message = "Number is required")
    @Size(max = 10, message = "Number must not exceed 10 characters")
    private String number;

    @NotBlank(message = "Neighborhood is required")
    private String neighborhood;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    @Pattern(regexp = "^[A-Z]{2}$", message = "State must be exactly 2 uppercase letters")
    private String state;

    @NotBlank(message = "Country is required")
    @Pattern(regexp = "^[A-Z]{2}$", message = "Country must be exactly 2 uppercase letters")
    private String country;
}