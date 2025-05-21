package com.ufpr.byteassist_backend.serializer;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.surrealdb.RecordId;

public class RecordIdDeserializer extends JsonDeserializer<RecordId> {
    @Override
    public RecordId deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String value = p.getValueAsString();
        if (value == null || value.isEmpty()) {
            return null;
        }
        
        String[] parts = value.split(":");
        if (parts.length != 2) {
            throw new IOException("Invalid RecordId format. Expected 'table:id', got '" + value + "'");
        }
        
        return new RecordId(parts[0], parts[1]);
    }
}
