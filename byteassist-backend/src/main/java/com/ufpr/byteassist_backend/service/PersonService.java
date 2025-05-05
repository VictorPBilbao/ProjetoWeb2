package com.ufpr.byteassist_backend.service;

import org.springframework.stereotype.Service;

import com.ufpr.byteassist_backend.model.Person;
import com.ufpr.byteassist_backend.repository.PersonRepoInterface;

@Service
public class PersonService {
    private final PersonRepoInterface personRepo;
    
    
    public PersonService(PersonRepoInterface personRepo) {
        this.personRepo = personRepo;
    }
    
    public Person getPerson(String username) {
        return personRepo.getPerson(username);
    }
    
    public Person updatePerson(Person person, String username) {
        return personRepo.updatePerson(person, username);
    }
    
    public void deletePerson(String username) {
        personRepo.deletePerson(username);
    }
}
