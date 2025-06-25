package com.ufpr.byteassist_backend.config;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

import org.springframework.core.convert.converter.Converter;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

@Component
public class StringToZonedDateTimeConverter implements Converter<String, ZonedDateTime> {
    
    private static final DateTimeFormatter LOCAL_DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
    
    @Override
    public ZonedDateTime convert(@NonNull String source) {
        if (source.trim().isEmpty()) {
            throw new IllegalArgumentException("Date string cannot be empty");
        }
        
        try {
            // Try to parse as ZonedDateTime first
            return ZonedDateTime.parse(source);
        } catch (DateTimeParseException e1) {
            try {
                // If not a ZonedDateTime, try as a LocalDate and convert to ZonedDateTime
                LocalDate date = LocalDate.parse(source, DateTimeFormatter.ISO_LOCAL_DATE);
                return date.atStartOfDay(ZoneId.systemDefault());
            } catch (DateTimeParseException e2) {
                try {
                    // Try to parse as LocalDateTime in format "yyyy-MM-dd'T'HH:mm:ss"
                    LocalDateTime dateTime = LocalDateTime.parse(source, LOCAL_DATE_TIME_FORMATTER);
                    return dateTime.atZone(ZoneId.systemDefault());
                } catch (DateTimeParseException e3) {
                    throw new IllegalArgumentException(
                        "Unable to parse date: " + source + 
                        ". Expected format: YYYY-MM-DD, YYYY-MM-DDTHH:MM:SS, or full datetime format", e3);
                }
            }
        }
    }
}
