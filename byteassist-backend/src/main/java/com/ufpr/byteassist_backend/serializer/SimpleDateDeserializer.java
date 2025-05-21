package com.ufpr.byteassist_backend.serializer;

import java.io.IOException;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.exc.InvalidFormatException;

public class SimpleDateDeserializer extends JsonDeserializer<ZonedDateTime> {
    
    @Override
    public ZonedDateTime deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String dateStr = p.getText();
        
        try {
            // Try to parse as ZonedDateTime first
            return ZonedDateTime.parse(dateStr);
        } catch (DateTimeParseException e1) {
            try {
                // If not a ZonedDateTime, try as a LocalDate and convert to ZonedDateTime
                LocalDate date = LocalDate.parse(dateStr, DateTimeFormatter.ISO_LOCAL_DATE);
                return date.atStartOfDay(ZoneId.systemDefault());
            } catch (DateTimeParseException e2) {
                throw new InvalidFormatException(p, 
                    "Expected format: YYYY-MM-DD or full datetime format", 
                    dateStr, ZonedDateTime.class);
            }
        }
    }
}
