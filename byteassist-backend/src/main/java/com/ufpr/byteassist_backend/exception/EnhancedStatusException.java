package com.ufpr.byteassist_backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import lombok.Getter;

@Getter
public class EnhancedStatusException extends ResponseStatusException {
    
    private final String description;
    
    public EnhancedStatusException(HttpStatus status, String reason, String description) {
        super(status, reason);
        this.description = description;
    }
}