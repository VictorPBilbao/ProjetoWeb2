package com.ufpr.byteassist_backend.serializer;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.surrealdb.RecordId;
import java.io.IOException;

public class RecordIdSerializer extends JsonSerializer<RecordId> {
    @Override
    public void serialize(RecordId value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        if (value == null) {
            gen.writeNull();
        } else {
            gen.writeString(value.toString());
        }
    }
}