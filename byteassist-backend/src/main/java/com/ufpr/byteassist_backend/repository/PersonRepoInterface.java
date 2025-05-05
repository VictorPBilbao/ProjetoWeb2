package com.ufpr.byteassist_backend.repository;

import java.util.Iterator;

import com.ufpr.byteassist_backend.model.Person;

public interface PersonRepoInterface {
    public Person getPerson(String username); // Retrieve a person record by username
    public Person createPerson(Person person, String username); // Create a new person record in the database
    public Person updatePerson(Person person, String username); // Update an existing person record by username
    public void deletePerson(String username); // Delete a person record by username
    public Iterator<Person> getAllPersons(); // Retrieve all person records from the database
}
