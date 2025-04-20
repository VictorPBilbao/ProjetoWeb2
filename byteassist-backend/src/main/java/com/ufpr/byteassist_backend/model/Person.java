package com.ufpr.byteassist_backend.model;

import java.time.ZonedDateTime;

import com.surrealdb.RecordId;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Person {
    public RecordId id;
    public String cpf;
    public ZonedDateTime dob;
    public String gender;
    public PersonAddress address;
    public PersonName name;
}
