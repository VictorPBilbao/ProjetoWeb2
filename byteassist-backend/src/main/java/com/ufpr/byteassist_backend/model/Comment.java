package com.ufpr.byteassist_backend.model;

import java.time.ZonedDateTime;

import com.surrealdb.RecordId;
import com.ufpr.byteassist_backend.validation.ValidationGroups;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Null;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Comment {
    @Null(message = "ID should not be provided in the request body")
    private RecordId id;
    
    @NotNull(groups = ValidationGroups.Create.class, message = "In ID cannot be null")
    private RecordId in;
    
    @NotNull(groups = ValidationGroups.Create.class, message = "Out ID cannot be null")
    private RecordId out;
    
    @NotBlank(groups = ValidationGroups.Create.class, message = "Comment cannot be blank")
    private String comment;
    
    @Null(message = "Do not provide comment date in the request body")
    private ZonedDateTime comment_date;
}
