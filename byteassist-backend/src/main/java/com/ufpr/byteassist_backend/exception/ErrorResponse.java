package com.ufpr.byteassist_backend.exception;

import org.springframework.http.HttpStatus;

import lombok.Builder;
import lombok.Data;
import java.util.Map;

@Data
@Builder
public class ErrorResponse {
    private String message;
    private int statusCode;
    private HttpStatus errorCode;
    private String errorDescription;
    private Map<String, String> validationErrors;
}