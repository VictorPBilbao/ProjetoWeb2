package com.ufpr.byteassist_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.ufpr.byteassist_backend.model.Person;
import com.ufpr.byteassist_backend.service.PersonService;
import com.ufpr.byteassist_backend.validation.ValidationGroups;


@RestController
@RequestMapping("/api/person")
public class PersonController {
    private final PersonService personService;

    public PersonController(PersonService personService) {
        this.personService = personService;
    }
    
    @GetMapping("/{username:[a-z0-9._]{3,30}}")
    public ResponseEntity<Object> getPerson(@PathVariable String username) {
        return personService.getPerson(username);
    }
    
    @PostMapping("/{username:[a-z0-9._]{3,30}}")
    public ResponseEntity<Object> createPerson(@PathVariable String username, @Validated(ValidationGroups.Create.class) @RequestBody Person person) {
        return personService.createPerson(person, username);
    }
    
    @PutMapping("/{username:[a-z0-9._]{3,30}}")
    public ResponseEntity<Object> updatePerson(@PathVariable String username, @Validated(ValidationGroups.Update.class) @RequestBody Person person) {
        return personService.updatePerson(person, username);
    }
    
    @DeleteMapping("/{username:[a-z0-9._]{3,30}}")
    public ResponseEntity<Object> deletePerson(@PathVariable String username) {
        return personService.deletePerson(username);
    }
    
    @GetMapping("/all")
    public ResponseEntity<Object> getAllPersons() {
        return personService.getAllPersons();
    }
}
