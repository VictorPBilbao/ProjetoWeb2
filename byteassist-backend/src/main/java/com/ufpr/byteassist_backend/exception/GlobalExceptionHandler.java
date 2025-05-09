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

import java.util.HashMap;
import java.util.Map;

/**
 * Classe responsável por tratar exceções globais na aplicação.
 * Utiliza a anotação @ControllerAdvice para interceptar exceções lançadas pelos controladores.
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Trata exceções de validação de argumentos (MethodArgumentNotValidException).
     * 
     * @param ex Exceção capturada.
     * @return ResponseEntity contendo detalhes do erro e status HTTP 400 (BAD_REQUEST).
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        BindingResult bindingResult = ex.getBindingResult();
        Map<String, String> errors = new HashMap<>();

        // Coleta os erros de validação e os armazena em um mapa
        for (FieldError error : bindingResult.getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }

        // Cria a resposta de erro com os detalhes da validação
        ErrorResponse errorResponse = ErrorResponse.builder()
                .message("Validation Error")
                .statusCode(HttpStatus.BAD_REQUEST.value())
                .errorCode(HttpStatus.BAD_REQUEST)
                .errorDescription("The provided data is invalid")
                .build();

        // Adiciona os erros de validação ao objeto de resposta
        errorResponse.setValidationErrors(errors);

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    /**
     * Trata exceções de ligação de dados (BindException).
     * 
     * @param ex Exceção capturada.
     * @return ResponseEntity contendo detalhes do erro e status HTTP 400 (BAD_REQUEST).
     */
    @ExceptionHandler(BindException.class)
    public ResponseEntity<ErrorResponse> handleBindExceptions(BindException ex) {
        Map<String, String> errors = new HashMap<>();

        // Coleta os erros de ligação e os armazena em um mapa
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        // Cria a resposta de erro com os detalhes da ligação
        ErrorResponse errorResponse = ErrorResponse.builder()
                .message("Validation Error")
                .statusCode(HttpStatus.BAD_REQUEST.value())
                .errorCode(HttpStatus.BAD_REQUEST)
                .errorDescription("The provided data contains validation errors")
                .build();

        // Adiciona os erros de validação ao objeto de resposta
        errorResponse.setValidationErrors(errors);

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    /**
     * Trata exceções relacionadas ao formato inválido do corpo da requisição (HttpMessageNotReadableException).
     * 
     * @param ex Exceção capturada.
     * @return ResponseEntity contendo detalhes do erro e status HTTP 400 (BAD_REQUEST).
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        // Cria a resposta de erro para formato inválido
        ErrorResponse errorResponse = ErrorResponse.builder()
                .message("Invalid request format")
                .statusCode(HttpStatus.BAD_REQUEST.value())
                .errorCode(HttpStatus.BAD_REQUEST)
                .errorDescription("The request body could not be read. Ensure it's in the correct format.")
                .build();

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    /**
     * Trata todas as exceções genéricas não capturadas por outros métodos.
     * 
     * @param ex Exceção capturada.
     * @return ResponseEntity contendo detalhes do erro e status HTTP 500 (INTERNAL_SERVER_ERROR).
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleAllExceptions(Exception ex) {
        // Cria a resposta de erro para exceções genéricas
        ErrorResponse errorResponse = ErrorResponse.builder()
                .message("Internal server error")
                .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .errorCode(HttpStatus.INTERNAL_SERVER_ERROR)
                .errorDescription("An unexpected error occurred: " + ex.getMessage())
                .build();

        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}