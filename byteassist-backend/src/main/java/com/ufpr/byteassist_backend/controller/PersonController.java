package com.ufpr.byteassist_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ufpr.byteassist_backend.model.Person;
import com.ufpr.byteassist_backend.service.PersonService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/people")
public class PersonController {
    private final PersonService personService;

    public PersonController(PersonService personService) {
        this.personService = personService;
    }
    
    @GetMapping("/{username}")
    public ResponseEntity<Object> getPerson(@PathVariable String username) {
        return personService.getPerson(username);
    }
    
    @PostMapping("/{username}")
    public ResponseEntity<Object> createPerson(@PathVariable String username, @Valid @RequestBody Person person) {
        return personService.createPerson(person, username);
    }
    
    @PutMapping(value = "/{username}")
    public ResponseEntity<Object> updatePerson(@PathVariable String username, @Valid @RequestBody Person person) {
        return personService.updatePerson(person, username);
    }
    
    @DeleteMapping("/{username}")
    public ResponseEntity<Object> deletePerson(@PathVariable String username) {
        return personService.deletePerson(username);
    }
    
    @GetMapping("/all")
    public ResponseEntity<Object> getAllPersons() {
        return personService.getAllPersons();
    }
}
