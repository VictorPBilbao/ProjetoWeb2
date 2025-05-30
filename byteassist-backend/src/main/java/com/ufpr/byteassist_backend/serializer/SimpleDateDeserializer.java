package com.ufpr.byteassist_backend.serializer;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.exc.InvalidFormatException;

public class SimpleDateDeserializer extends JsonDeserializer<ZonedDateTime> {
    
    private static final DateTimeFormatter LOCAL_DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
    
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
                try {
                    // Try to parse as LocalDateTime in format "yyyy-MM-dd'T'HH:mm:ss"
                    LocalDateTime dateTime = LocalDateTime.parse(dateStr, LOCAL_DATE_TIME_FORMATTER);
                    return dateTime.atZone(ZoneId.systemDefault());
                } catch (DateTimeParseException e3) {
                    throw new InvalidFormatException(p, 
                        "Expected format: YYYY-MM-DD, YYYY-MM-DDTHH:MM:SS, or full datetime format", 
                        dateStr, ZonedDateTime.class);
                }
            }
        }
    }
}
