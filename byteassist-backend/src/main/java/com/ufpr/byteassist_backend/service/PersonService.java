package com.ufpr.byteassist_backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.ufpr.byteassist_backend.exception.EnhancedStatusException;
import com.ufpr.byteassist_backend.model.Person;
import com.ufpr.byteassist_backend.repository.PersonRepoInterface;

@Service
public class PersonService {
    private final PersonRepoInterface personRepo;
    
    
    public PersonService(PersonRepoInterface personRepo) {
        this.personRepo = personRepo;
    }
    
    public ResponseEntity<Person> getPerson(String username) {
        Optional<Person> person = personRepo.getPerson(username);
        if (person.isEmpty()) {
            throw new EnhancedStatusException(
                HttpStatus.NOT_FOUND,
                "Person with username " + username + " not found",
                "The person with the specified username does not exist"
            );
        }
        return ResponseEntity.ok(person.get());
    }
    
    public ResponseEntity<Person> createPerson(Person person, String username) {
        Optional<Person> createdPerson = personRepo.createPerson(person, username);
        if (createdPerson.isEmpty()) {
            throw new EnhancedStatusException(
                HttpStatus.CONFLICT,
                "Person with username " + username + " already exists or database error occurred",
                "The person could not be created because the username is already taken or there was a database error"
            );
        }
        return ResponseEntity.ok(createdPerson.get());
    }
    
    public ResponseEntity<Person> updatePerson(Person person, String username) {
        Optional<Person> updatedPerson = personRepo.updatePerson(person, username);
        if (updatedPerson.isEmpty()) {
            throw new EnhancedStatusException(
                HttpStatus.NOT_FOUND,
                "Person with username " + username + " not found",
                "The person with the specified username does not exist and cannot be updated"
            );
        }
        return ResponseEntity.ok(updatedPerson.get());
    }
    
    public ResponseEntity<Void> deletePerson(String username) {
        boolean deleted = personRepo.deletePerson(username);
        if (!deleted) {
            throw new EnhancedStatusException(
                HttpStatus.NOT_FOUND,
                "Person with username " + username + " not found",
                "The person with the specified username does not exist and cannot be deleted"
            );
        }
        return ResponseEntity.noContent().build();
    }
    
    public ResponseEntity<List<Person>> getAllPersons() {
        Optional<List<Person>> persons = personRepo.getAllPersons();
        if (persons.isEmpty()) {
            throw new EnhancedStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Error retrieving all persons from database",
                "There was a problem accessing the database to retrieve the list of persons"
            );
        }
        return ResponseEntity.ok(persons.get());
    }
}
