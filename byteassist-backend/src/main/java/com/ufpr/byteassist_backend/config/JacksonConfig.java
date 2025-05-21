package com.ufpr.byteassist_backend.config;

import java.time.ZonedDateTime;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.surrealdb.RecordId;
import com.ufpr.byteassist_backend.serializer.RecordIdDeserializer;
import com.ufpr.byteassist_backend.serializer.RecordIdSerializer;
import com.ufpr.byteassist_backend.serializer.SimpleDateDeserializer;
import com.ufpr.byteassist_backend.serializer.SimpleDateSerializer;

@Configuration
public class JacksonConfig {

    @Bean
    @Primary
    public ObjectMapper objectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        
        SimpleModule module = new SimpleModule();
        // Register ZonedDateTime serializers
        module.addSerializer(ZonedDateTime.class, new SimpleDateSerializer());
        module.addDeserializer(ZonedDateTime.class, new SimpleDateDeserializer());
        
        // Register RecordId serializers
        module.addSerializer(RecordId.class, new RecordIdSerializer());
        module.addDeserializer(RecordId.class, new RecordIdDeserializer());
        
        objectMapper.registerModule(module);
        
        return objectMapper;
    }
}