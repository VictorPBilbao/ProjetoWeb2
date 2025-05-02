package com.ufpr.byteassist_backend.repository;

import com.surrealdb.RecordId;
import com.ufpr.byteassist_backend.model.Person;

public interface PersonRepoInterface {
    public Person getPerson(String username); // Retrieve a person record by username
    public RecordId createPerson(Person person, String username); // Create a new person record in the database
    public Person updatePerson(Person person, String username); // Update an existing person record by username
}
