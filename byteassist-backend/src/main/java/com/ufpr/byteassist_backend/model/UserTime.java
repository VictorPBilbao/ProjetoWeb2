package com.ufpr.byteassist_backend.model;

import java.time.ZonedDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserTime {
    private ZonedDateTime createdAt;
    private ZonedDateTime lastLoginAt;
    private ZonedDateTime updatedAt;
}
