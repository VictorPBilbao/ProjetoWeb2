package com.ufpr.byteassist_backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ufpr.byteassist_backend.model.Person;
import com.ufpr.byteassist_backend.model.User;
import com.ufpr.byteassist_backend.service.PersonService;
import com.ufpr.byteassist_backend.validation.ValidationGroups;


@RestController
@RequestMapping("/api/person")
public class PersonController {
    private final PersonService personService;

    public PersonController(PersonService personService) {
        this.personService = personService;
    }
    
    @GetMapping("/me")
    public ResponseEntity<Person> getCurrentPerson() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = user.getUsername();
        return personService.getPerson(username);
    }

    @GetMapping("/{username:[a-z0-9._]{3,30}}")
    @PreAuthorize("hasRole('ADMIN') or #username == authentication.principal.username")
    public ResponseEntity<Person> getPerson(@PathVariable String username) {
        return personService.getPerson(username);
    }
    
    @GetMapping()
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Person>> getAllPersons() {
        return personService.getAllPersons();
    }
    
    @PostMapping("/{username:[a-z0-9._]{3,30}}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Person> createPerson(@PathVariable String username, @Validated(ValidationGroups.Create.class) @RequestBody Person person) {
        return personService.createPerson(person, username);
    }
    
    @PatchMapping("/{username:[a-z0-9._]{3,30}}")
    @PreAuthorize("hasRole('ADMIN') or #username == authentication.principal.username")
    public ResponseEntity<Person> updatePerson(@PathVariable String username, @Validated(ValidationGroups.Update.class) @RequestBody Person person) {
        return personService.updatePerson(person, username);
    }
    
    @DeleteMapping("/{username:[a-z0-9._]{3,30}}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePerson(@PathVariable String username) {
        return personService.deletePerson(username);
    }
    
}
