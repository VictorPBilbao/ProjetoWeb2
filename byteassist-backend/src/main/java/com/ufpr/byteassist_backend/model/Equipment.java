package com.ufpr.byteassist_backend.model;

import com.surrealdb.RecordId;
import com.ufpr.byteassist_backend.validation.ValidationGroups;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Null;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Equipment {
    @Null(message = "ID should not be provided in the request body, use the URL instead")
    private RecordId id;
    
    @NotBlank(groups = ValidationGroups.Create.class, message = "Brand cannot be blank when creating an equipment")
    private String brand;
    
    @NotBlank(groups = ValidationGroups.Create.class, message = "Model cannot be blank when creating an equipment")
    private String model;
    
    @NotBlank(groups = ValidationGroups.Create.class, message = "Type cannot be blank when creating an equipment")
    private String type;
    
    private String color;
}
