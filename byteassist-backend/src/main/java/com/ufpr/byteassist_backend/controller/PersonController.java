package com.ufpr.byteassist_backend.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import com.ufpr.byteassist_backend.model.Person;
import com.ufpr.byteassist_backend.service.PersonService;

@RestController
@RequestMapping("/person")
public class PersonController {
    private final PersonService personService;

    public PersonController(PersonService personService) {
        this.personService = personService;
    }
    
    @GetMapping("/{username}")
    public Person getPerson(@PathVariable String username) {
        return personService.getPerson(username);
    }
    
    @PutMapping(value = "/{username}", consumes = { MediaType.APPLICATION_FORM_URLENCODED_VALUE })
    public Person updatePerson(@PathVariable String username, @RequestBody Person person) {
        return personService.updatePerson(person, username);
    }
}
