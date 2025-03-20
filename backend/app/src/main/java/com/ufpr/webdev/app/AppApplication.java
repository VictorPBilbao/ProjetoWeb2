package com.ufpr.webdev.app;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RestController;

@RestController
@SpringBootApplication
public class AppApplication {

    public static void main(String[] args) {
        org.springframework.boot.SpringApplication.run(AppApplication.class, args);
    }

}