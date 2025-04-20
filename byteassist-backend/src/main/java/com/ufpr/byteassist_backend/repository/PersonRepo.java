package com.ufpr.byteassist_backend.repository;

import org.springframework.stereotype.Repository;

import com.surrealdb.RecordId;
import com.surrealdb.Surreal;
import com.ufpr.byteassist_backend.model.Person;
import com.ufpr.byteassist_backend.service.DatabaseService;

@Repository
public class PersonRepo {
    private final Surreal db;

    public PersonRepo(DatabaseService databaseService) {
        this.db = databaseService.getDatabase();
    }

    public RecordId createPerson(Person person, String username) {
        System.out.println("Creating person with username: " + username);
        System.out.println("Person details: " + person);
        Person created = db.create(Person.class, new RecordId("Person", username), person);
        System.out.println("Person created successfully with ID: " + created.getId());
        return created.getId();
    }

}
