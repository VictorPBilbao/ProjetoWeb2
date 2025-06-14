package com.ufpr.byteassist_backend.model;

import com.ufpr.byteassist_backend.validation.ValidationGroups;

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
    @NotBlank(groups = {ValidationGroups.Create.class})
    @Pattern(regexp = "\\d{8}", message = "ZIP code must contain exactly 8 digits")
    private String zip;
    
    @NotBlank(groups = {ValidationGroups.Create.class})
    @Size(min = 1, max = 10, message = "Number must be between 1 and 10 characters")
    private String number;
    
    @NotBlank(groups = {ValidationGroups.Create.class})
    @Size(min = 3, max = 100, message = "Street must be between 3 and 100 characters")
    private String street;
    
    @NotBlank(groups = {ValidationGroups.Create.class})
    @Size(min = 2, max = 50, message = "Neighborhood must be between 2 and 50 characters")
    private String neighborhood;
    
    @Size(max = 100, message = "Complement must be up to 100 characters")
    private String complement; // optional field, can be null or empty in the database
    
    @NotBlank(groups = {ValidationGroups.Create.class})
    @Size(min = 2, max = 50, message = "City must be between 2 and 50 characters")
    private String city;
    
    @NotBlank(groups = {ValidationGroups.Create.class})
    @Pattern(regexp = "^[A-Z]{2}$", message = "State must be exactly 2 uppercase letters")
    private String state;
    
    @NotBlank(groups = {ValidationGroups.Create.class})
    private String country;
}
