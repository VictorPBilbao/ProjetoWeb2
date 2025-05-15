package com.ufpr.byteassist_backend.repository;

import java.util.Iterator;
import java.util.Optional;

import com.ufpr.byteassist_backend.model.Person;

public interface PersonRepoInterface {
    public Optional<Person> getPerson(String username); // Retrieve a person record by username
    public Optional<Person> createPerson(Person person, String username); // Create a new person record in the database
    public Optional<Person> updatePerson(Person person, String username); // Update an existing person record by username
    public Boolean deletePerson(String username); // Delete a person record by username, returns success status
    public Optional<Iterator<Person>> getAllPersons(); // Retrieve all person records from the database
}
