package com.ufpr.byteassist_backend.model;

import java.time.ZonedDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskTime {
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;
}
