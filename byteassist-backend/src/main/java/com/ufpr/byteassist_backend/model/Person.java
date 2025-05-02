package com.ufpr.byteassist_backend.model;

import java.time.ZonedDateTime;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.surrealdb.RecordId;
import com.ufpr.byteassist_backend.serializer.RecordIdSerializer;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Person {
    @JsonSerialize(using = RecordIdSerializer.class)
    public RecordId id;
    public String cpf;
    public ZonedDateTime dob;
    public String gender;
    public PersonAddress address;
    public PersonName name;
}