package com.ufpr.byteassist_backend.model;

import com.surrealdb.RecordId;
import com.ufpr.byteassist_backend.validation.ValidationGroups;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Null;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Budget {
    @Null(message = "ID should not be provided in the request body")
    private RecordId id;
    
    @NotNull(groups = ValidationGroups.Create.class, message = "Amount cannot be null")
    @Min(value = 1, message = "Amount must be greater than 0")
    private Integer amount;
    
    @NotBlank(groups = ValidationGroups.Create.class, message = "Description cannot be blank")
    private String description;
    
    @NotNull(groups = ValidationGroups.Create.class, message = "Creator can not be blank")
    private RecordId creator;
    
    // can be 'PENDENTE' | 'ACEITA' | 'REJEITADA'
    @Pattern(regexp = "^(PENDENTE|ACEITA|REJEITADA)$", 
             message = "accepted must be one of: PENDENTE, ACEITA, REJEITADA")
    private String accepted;
}
