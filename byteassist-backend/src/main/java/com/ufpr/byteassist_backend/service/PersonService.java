package com.ufpr.byteassist_backend.service;

import java.util.Iterator;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.ufpr.byteassist_backend.exception.ErrorResponse;
import com.ufpr.byteassist_backend.model.Person;
import com.ufpr.byteassist_backend.repository.PersonRepoInterface;

@Service
public class PersonService {
    private final PersonRepoInterface personRepo;
    
    
    public PersonService(PersonRepoInterface personRepo) {
        this.personRepo = personRepo;
    }
    
    public ResponseEntity<Object> getPerson(String username) {
        Optional<Person> person = personRepo.getPerson(username);
        if (person.isEmpty()) {
            ErrorResponse errorResponse = ErrorResponse.builder()
                    .message("Person not found")
                    .errorCode(HttpStatus.NOT_FOUND)
                    .statusCode(HttpStatus.NOT_FOUND.value())
                    .errorDescription("Person with username " + username + " not found")
                    .build();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
        return ResponseEntity.ok(person.get());
    }
    
    public ResponseEntity<Object> createPerson(Person person, String username) {
        Optional<Person> createdPerson = personRepo.createPerson(person, username);
        if (createdPerson.isEmpty()) {
            ErrorResponse errorResponse = ErrorResponse.builder()
                    .message("Failed to create person")
                    .errorCode(HttpStatus.CONFLICT)
                    .statusCode(HttpStatus.CONFLICT.value())
                    .errorDescription("Person with username " + username + " already exists or database error occurred")
                    .build();
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
        }
        return ResponseEntity.ok(createdPerson.get());
    }
    
    public ResponseEntity<Object> updatePerson(Person person, String username) {
        Optional<Person> updatedPerson = personRepo.updatePerson(person, username);
        if (updatedPerson.isEmpty()) {
            ErrorResponse errorResponse = ErrorResponse.builder()
                    .message("Failed to update person")
                    .errorCode(HttpStatus.NOT_FOUND)
                    .statusCode(HttpStatus.NOT_FOUND.value())
                    .errorDescription("Person with username " + username + " not found")
                    .build();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
        return ResponseEntity.ok(updatedPerson.get());
    }
    
    public ResponseEntity<Object> deletePerson(String username) {
        boolean deleted = personRepo.deletePerson(username);
        if (!deleted) {
            ErrorResponse errorResponse = ErrorResponse.builder()
                    .message("Failed to delete person")
                    .errorCode(HttpStatus.NOT_FOUND)
                    .statusCode(HttpStatus.NOT_FOUND.value())
                    .errorDescription("Person with username " + username + " not found")
                    .build();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
        return ResponseEntity.noContent().build();
    }
    
    public ResponseEntity<Object> getAllPersons() {
        Optional<Iterator<Person>> persons = personRepo.getAllPersons();
        if (persons.isEmpty()) {
            ErrorResponse errorResponse = ErrorResponse.builder()
                    .message("Failed to retrieve persons")
                    .errorCode(HttpStatus.INTERNAL_SERVER_ERROR)
                    .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .errorDescription("Error retrieving all persons from database")
                    .build();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
        return ResponseEntity.ok(persons.get());
    }
}
