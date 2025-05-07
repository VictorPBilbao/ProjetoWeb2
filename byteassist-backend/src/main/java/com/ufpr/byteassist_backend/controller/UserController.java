package com.ufpr.byteassist_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.ufpr.byteassist_backend.model.User;
import com.ufpr.byteassist_backend.service.UserService;
import com.ufpr.byteassist_backend.validation.ValidationGroups;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;
    
    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    @GetMapping("/{username:[a-z0-9._]{3,30}}")
    public ResponseEntity<Object> getUser(@PathVariable String username) {
        return userService.getUser(username);
    }
    
    @PostMapping("/{username:[a-z0-9._]{3,30}}")
    public ResponseEntity<Object> createUser(@Validated(ValidationGroups.Create.class) @RequestBody User user, @PathVariable String username) {
        return userService.createUser(user, username);
    }
    
    @PutMapping("/{username:[a-z0-9._]{3,30}}")
    public ResponseEntity<Object> updateUser(@Validated(ValidationGroups.Update.class) @RequestBody User user, @PathVariable String username) {
        return userService.updateUser(user, username);
    }
    
    @DeleteMapping("/{username:[a-z0-9._]{3,30}}")
    public ResponseEntity<Object> deleteUser(@PathVariable String username) {
        return userService.deleteUser(username);
    }
    
    @GetMapping("/all")
    public ResponseEntity<Object> getAllUsers() {
        return userService.getAllUsers();
    }
}