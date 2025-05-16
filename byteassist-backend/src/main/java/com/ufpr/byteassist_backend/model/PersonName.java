package com.ufpr.byteassist_backend.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PersonName {
    @NotBlank
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    private String first;
    
    @NotBlank
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    private String last;
}