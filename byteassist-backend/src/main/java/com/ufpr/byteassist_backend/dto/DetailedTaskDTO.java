package com.ufpr.byteassist_backend.dto;

import com.surrealdb.RecordId;
import com.ufpr.byteassist_backend.model.Budget;
import com.ufpr.byteassist_backend.model.Equipment;
import com.ufpr.byteassist_backend.model.TaskTime;
import com.ufpr.byteassist_backend.model.User;
import com.ufpr.byteassist_backend.validation.ValidationGroups;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Null;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DetailedTaskDTO {
    @Null(message = "ID should not be provided in the request body")
    private RecordId id;
    
    @Valid
    private User assignee;
    
    @Valid
    private User creator;
    
    @Valid
    private Budget budget;
    
    @Valid
    private Equipment equipment;
    
    private String status;
    
    private String summary;
    
    private String title;
    
    private String type;
    
    private TaskTime time;
}
