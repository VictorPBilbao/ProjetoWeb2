package com.ufpr.byteassist_backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final StringToZonedDateTimeConverter stringToZonedDateTimeConverter;

    public WebConfig(StringToZonedDateTimeConverter stringToZonedDateTimeConverter) {
        this.stringToZonedDateTimeConverter = stringToZonedDateTimeConverter;
    }

    @Override
    public void addFormatters(@NonNull FormatterRegistry registry) {
        registry.addConverter(stringToZonedDateTimeConverter);
    }
}
