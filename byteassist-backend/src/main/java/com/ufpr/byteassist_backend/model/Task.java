package com.ufpr.byteassist_backend.model;


import com.surrealdb.RecordId;
import com.ufpr.byteassist_backend.validation.ValidationGroups;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Null;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Task {
    @Null(message = "ID should not be provided in the request body")
    private RecordId id;
    
    private RecordId assignee;
    
    private RecordId creator;
    
    private RecordId budget;
    
    @NotNull(groups = ValidationGroups.Create.class, message = "Equipment ID cannot be null")
    private RecordId equipment;
    
    @NotBlank(groups = ValidationGroups.Create.class, message = "Name cannot be blank")
    private String status;
    
    @NotBlank(groups = ValidationGroups.Create.class, message = "Description cannot be blank")
    private String summary;
    
    @NotBlank(groups = ValidationGroups.Create.class, message = "Title cannot be blank")
    private String title;
    
    @NotBlank(groups = ValidationGroups.Create.class, message = "Type cannot be blank")
    private String type;
}
