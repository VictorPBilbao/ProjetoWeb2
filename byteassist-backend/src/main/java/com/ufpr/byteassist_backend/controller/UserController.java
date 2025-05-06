package com.ufpr.byteassist_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ufpr.byteassist_backend.model.User;
import com.ufpr.byteassist_backend.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    
    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    @GetMapping("/{username}")
    public ResponseEntity<Object> getUser(@PathVariable String username) {
        return userService.getUser(username);
    }
    
    @PostMapping("/{username}")
    public ResponseEntity<Object> createUser(@RequestBody User user, @PathVariable String username) {
        return userService.createUser(user, username);
    }
    
    @PutMapping("/{username}")
    public ResponseEntity<Object> updateUser(@RequestBody User user, @PathVariable String username) {
        return userService.updateUser(user, username);
    }
    
    @DeleteMapping("/{username}")
    public ResponseEntity<Object> deleteUser(@PathVariable String username) {
        return userService.deleteUser(username);
    }
    
    @GetMapping
    public ResponseEntity<Object> getAllUsers() {
        return userService.getAllUsers();
    }
}
