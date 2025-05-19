package com.ufpr.byteassist_backend.model;

import java.util.Optional;

import com.surrealdb.RecordId;

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
    
    private RecordId asignee;
    
    @NotNull(message = "Creator ID cannot be null")
    private RecordId creator;
    
    private RecordId budget;
    
    @NotNull(message = "Equipment ID cannot be null")
    private RecordId equipment;
    
    @NotBlank(message = "Name cannot be blank")
    private String status;
    
    @NotBlank(message = "Description cannot be blank")
    private String summary;
    
    @NotBlank(message = "Title cannot be blank")
    private String title;
    
    @NotBlank(message = "Type cannot be blank")
    private String type;
}
