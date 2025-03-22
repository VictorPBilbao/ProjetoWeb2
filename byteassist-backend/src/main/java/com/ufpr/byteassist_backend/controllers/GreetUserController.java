package com.ufpr.byteassist_backend.controllers;

import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
public class GreetUserController {

    @GetMapping("/")
    public String getMethodName() {
        return "Hello, World!";
    }

    // GET: /api/hello?name=YourName
    @GetMapping("/hello")
    public String sayHello(@RequestParam(defaultValue = "World") String name) {
        return "Hello " + name;
    }

    // GET with a path parameter: /api/users/{userId}
    @GetMapping("/users/{userId}")
    public String getUser(@PathVariable String userId) {
        return "User with id: " + userId;
    }

    // POST: /api/greet
    @PostMapping("/greet")
    public Map<String, String> greetUser(@RequestParam String name) {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Hello, " + name);
        return response;
    }

    // POST: /api/echo
    @PostMapping("/echo")
    public Map<String, Object> echoRequest(@RequestParam Map<String, Object> requestBody) {
        return requestBody;
    }

}
