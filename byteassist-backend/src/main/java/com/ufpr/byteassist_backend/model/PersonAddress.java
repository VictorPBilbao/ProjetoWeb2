package com.ufpr.byteassist_backend.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PersonAddress {
    @NotBlank
    @Pattern(regexp = "\\d{8}", message = "ZIP code must contain exactly 8 digits")
    private String zip;
    
    @NotBlank
    @Size(min = 1, max = 10, message = "Number must be between 1 and 10 characters")
    private String number;
    
    @NotBlank
    @Size(min = 3, max = 100, message = "Street must be between 3 and 100 characters")
    private String street;
    
    @NotBlank
    @Size(min = 2, max = 50, message = "Neighborhood must be between 2 and 50 characters")
    private String neighborhood;
    
    @NotBlank
    @Size(min = 2, max = 50, message = "City must be between 2 and 50 characters")
    private String city;
    
    @NotBlank
    @Pattern(regexp = "^[A-Z]{2}$", message = "State must be exactly 2 uppercase letters")
    private String state;
    
    @NotBlank
    @Pattern(regexp = "^[A-Z]{2}$", message = "Country must be exactly 2 uppercase letters (ISO 3166-1 alpha-2 code)")
    private String country;
}
