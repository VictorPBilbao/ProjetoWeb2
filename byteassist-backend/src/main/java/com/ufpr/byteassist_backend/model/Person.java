package com.ufpr.byteassist_backend.model;

import java.time.ZonedDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.surrealdb.RecordId;
import com.ufpr.byteassist_backend.serializer.RecordIdDeserializer;
import com.ufpr.byteassist_backend.serializer.RecordIdSerializer;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@RequiredArgsConstructor
public class Person {
    @JsonSerialize(using = RecordIdSerializer.class)
    @JsonDeserialize(using = RecordIdDeserializer.class)
    public RecordId id;
    @NonNull public String cpf;
    @NonNull public ZonedDateTime dob;
    @NonNull public String gender;
    
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @NonNull public PersonAddress address;
    @NonNull public PersonName name;
}