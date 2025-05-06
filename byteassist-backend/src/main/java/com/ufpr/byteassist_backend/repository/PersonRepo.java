package com.ufpr.byteassist_backend.repository;

import java.util.Iterator;
import java.util.Optional;

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
    public Optional<Person> getPerson(String username) {
        try {
            return db.select(Person.class, new RecordId("Person", username));
        } catch (Exception e) {
            return Optional.empty();
        }
    }
    
    @Override
    public Optional<Person> createPerson(Person person, String username) {
        try {
            return Optional.ofNullable(db.create(Person.class, new RecordId("Person", username), person));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<Person> updatePerson(Person person, String username) {
        try {
            return Optional.ofNullable(db.update(Person.class, new RecordId("Person", username), UpType.CONTENT, person));
        } catch (Exception e) {
            return Optional.empty();
        }
    }
    
    @Override
    public Boolean deletePerson(String username) {
        try {
            db.delete(new RecordId("Person", username));
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    
    @Override
    public Optional<Iterator<Person>> getAllPersons() {
        try {
            Iterator<Person> persons = db.select(Person.class, "Person");
            return Optional.ofNullable(persons);
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}