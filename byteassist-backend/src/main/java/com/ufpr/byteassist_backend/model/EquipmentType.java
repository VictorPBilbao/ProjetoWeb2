package com.ufpr.byteassist_backend.model;

import java.time.ZonedDateTime;

import com.surrealdb.RecordId;

import jakarta.validation.constraints.Null;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EquipmentType {
    @Null(message = "ID should not be provided in the request body")
    private RecordId id;
    
    private boolean active;
    
    @Null(message = "Created at should not be provided in the request body as it is automatically generated")
    private ZonedDateTime createdAt;
    
    private String description;
}
