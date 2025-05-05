package com.ufpr.byteassist_backend.repository;

import org.springframework.stereotype.Repository;

import com.surrealdb.RecordId;
import com.surrealdb.Surreal;
import com.surrealdb.UpType;
import com.ufpr.byteassist_backend.model.Person;
import com.ufpr.byteassist_backend.service.DatabaseService;

@Repository
public class PersonRepo implements PersonRepoInterface {
    private final Surreal db;

    public PersonRepo(DatabaseService databaseService) {
        this.db = databaseService.getDatabase();
    }
    
    @Override
    public RecordId createPerson(Person person, String username) {
        Person created = db.create(Person.class, new RecordId("Person", username), person);
        return created.getId();
    }
    
    @Override
    public Person getPerson(String username) {
        return db.select(Person.class, new RecordId("Person", username))
                 .orElseThrow(() -> new RuntimeException("Person not found for username: " + username));
    }

    @Override
    public Person updatePerson(Person person, String username) {
        return db.update(Person.class, new RecordId("Person", username), UpType.CONTENT, person);
    }
    
    @Override
    public void deletePerson(String username) {
        db.delete(new RecordId("Person", username));
    }
}