package com.ufpr.byteassist_backend.util;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.surrealdb.RecordId;
import com.ufpr.byteassist_backend.model.Person;
import com.ufpr.byteassist_backend.model.User;
import com.ufpr.byteassist_backend.service.PersonService;

/**
 * Utility class for handling entity expansion in API responses.
 * Centralizes the logic for expanding relationships like User->Person.
 */
@Component
public class EntityExpander {
    private final PersonService personService;
    
    public EntityExpander(PersonService personService) {
        this.personService = personService;
    }
    
    public User expandUser(User user, List<String> expand) {
        if (expand != null && expand.contains("person") && user.getPerson() != null) {
            Person person = personService.getPerson(user.getPerson().getId().toString().replaceAll("[⟨⟩]", "")).getBody();
            user.setPersonDetail(person);
        }
        return user;
    }
    
    public List<User> expandUsers(List<User> users, List<String> expand) {
        if (users == null || users.isEmpty() || expand == null || !expand.contains("person")) {
            return users;
        }
        
        // Collect all person IDs needed
        List<String> personIds = users.stream()
            .filter(user -> user.getPerson() != null)
            .map(user -> user.getPerson().getId().toString())
            .toList();
            
        if (personIds.isEmpty()) {
            return users;
        }
        
        // Fetch all persons in one call and create a lookup map
        List<Person> persons = personService.getAllPersons().getBody();
        if (persons == null) {
            return users;
        }
        
        Map<String, Person> personMap = persons.stream()
            .collect(Collectors.toMap(
                person -> person.getId().getId().toString().replaceAll("[⟨⟩]", ""),
                Function.identity()
            ));
            
        // Associate each user with its person
        for (User user : users) {
            if (user.getPerson() != null) {
                String personId = user.getPerson().getId().toString().replaceAll("[⟨⟩]", "");
                Person person = personMap.get(personId);
                if (person != null) {
                    user.setPersonDetail(person);
                }
            }
        }
        
        return users;
    }
}
