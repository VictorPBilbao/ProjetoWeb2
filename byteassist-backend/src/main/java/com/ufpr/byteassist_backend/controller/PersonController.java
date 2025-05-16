package com.ufpr.byteassist_backend.controller;

import java.util.List;

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
    public ResponseEntity<Person> getPerson(@PathVariable String username) {
        return personService.getPerson(username);
    }
    
    @PostMapping("/{username:[a-z0-9._]{3,30}}")
    public ResponseEntity<Person> createPerson(@PathVariable String username, @Validated(ValidationGroups.Create.class) @RequestBody Person person) {
        return personService.createPerson(person, username);
    }
    
    @PutMapping("/{username:[a-z0-9._]{3,30}}")
    public ResponseEntity<Person> updatePerson(@PathVariable String username, @Validated(ValidationGroups.Update.class) @RequestBody Person person) {
        return personService.updatePerson(person, username);
    }
    
    @DeleteMapping("/{username:[a-z0-9._]{3,30}}")
    public ResponseEntity<Void> deletePerson(@PathVariable String username) {
        return personService.deletePerson(username);
    }
    
    @GetMapping()
    public ResponseEntity<List<Person>> getAllPersons() {
        return personService.getAllPersons();
    }
}
