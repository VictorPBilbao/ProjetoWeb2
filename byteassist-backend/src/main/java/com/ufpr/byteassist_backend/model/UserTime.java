package com.ufpr.byteassist_backend.model;

import java.time.ZonedDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserTime {
    public ZonedDateTime createdAt;
    public ZonedDateTime lastLoginAt;
    public ZonedDateTime updatedAt;
}
