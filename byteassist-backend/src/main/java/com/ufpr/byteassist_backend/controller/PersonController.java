package com.ufpr.byteassist_backend.controller;

import java.util.Iterator;

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
    
    @PostMapping("/{username}")
    public Person createPerson(@PathVariable String username, @RequestBody Person person) {
        return personService.createPerson(person, username);
    }
    
    @PutMapping(value = "/{username}")
    public Person updatePerson(@PathVariable String username, @RequestBody Person person) {
        return personService.updatePerson(person, username);
    }
    
    @DeleteMapping("/{username}")
    public void deletePerson(@PathVariable String username) {
        personService.deletePerson(username);
    }
    
    @GetMapping("/all")
    public Iterator<Person> getAllPersons() {
        return personService.getAllPersons();
    }
}
