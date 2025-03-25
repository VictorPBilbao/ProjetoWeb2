package com.ufpr.byteassist_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ByteassistBackendApplication {

    public static void main(String[] args) {
        System.out.println("Starting application...");
        SpringApplication.run(ByteassistBackendApplication.class, args);
    }
}
