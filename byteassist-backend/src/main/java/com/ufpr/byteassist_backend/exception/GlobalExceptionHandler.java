package com.ufpr.byteassist_backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        BindingResult bindingResult = ex.getBindingResult();
        Map<String, String> errors = new HashMap<>();

        for (FieldError error : bindingResult.getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }

        ErrorResponse errorResponse = ErrorResponse.builder()
                .message("Validation Error")
                .statusCode(HttpStatus.BAD_REQUEST.value())
                .errorCode(HttpStatus.BAD_REQUEST)
                .errorDescription("The provided data is invalid")
                .build();

        // Manually set validation errors since builder may not be updated
        errorResponse.setValidationErrors(errors);

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(BindException.class)
    public ResponseEntity<ErrorResponse> handleBindExceptions(BindException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        ErrorResponse errorResponse = ErrorResponse.builder()
                .message("Validation Error")
                .statusCode(HttpStatus.BAD_REQUEST.value())
                .errorCode(HttpStatus.BAD_REQUEST)
                .errorDescription("The provided data contains validation errors")
                .build();

        // Manually set validation errors
        errorResponse.setValidationErrors(errors);

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        ErrorResponse errorResponse = ErrorResponse.builder()
                .message("Invalid request format")
                .statusCode(HttpStatus.BAD_REQUEST.value())
                .errorCode(HttpStatus.BAD_REQUEST)
                .errorDescription("The request body could not be read. Ensure it's in the correct format.")
                .build();

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleAllExceptions(Exception ex) {
        ErrorResponse errorResponse = ErrorResponse.builder()
                .message("Internal server error")
                .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .errorCode(HttpStatus.INTERNAL_SERVER_ERROR)
                .errorDescription("An unexpected error occurred: " + ex.getMessage())
                .build();

        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Object> handleMethodArgumentTypeMismatch(MethodArgumentTypeMismatchException ex) {
        Map<String, Object> body = new HashMap<>();
        
        String paramName = ex.getName();
        if ("username".equals(paramName)) {
            body.put("error", "Invalid username format");
            body.put("message", "Username must be 3-30 characters long and contain only lowercase letters, numbers, dots, and underscores");
        } else {
            body.put("error", "Invalid parameter: " + paramName);
            body.put("message", ex.getMessage());
        }
        
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<Object> handleNoHandlerFound(NoHandlerFoundException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", "Resource not found");
        
        // Check if this might be a username path variable issue
        String path = ex.getRequestURL();
        if (path.contains("/api/user/") || path.contains("/api/person/")) {
            body.put("message", "The requested resource was not found. If you're trying to access a user profile, " +
                    "make sure the username follows the required format (3-30 lowercase letters, numbers, dots, or underscores)");
        } else {
            body.put("message", "The requested resource was not found");
        }
        
        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }
}