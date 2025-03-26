package com.ufpr.byteassist_backend.controller;

import org.springframework.web.bind.annotation.RestController;

import com.surrealdb.Surreal;
import com.ufpr.byteassist_backend.model.User;
import com.ufpr.byteassist_backend.service.DatabaseService;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
public class GreetUserController {

    private final Surreal db;

    public GreetUserController(DatabaseService databaseService) {
        this.db = databaseService.getDatabase();
    }

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

    // GET endpoint to return all users from the database
    @GetMapping("/users")
    public String getAllUsers() {
        Iterator<User> users = db.select(User.class, "Users");
        while (users.hasNext()) {
            System.out.println("Found user: " + users.next().toString());
        }
        return "teste";
    }

}
