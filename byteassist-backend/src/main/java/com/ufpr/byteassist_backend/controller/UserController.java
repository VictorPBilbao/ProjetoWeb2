package com.ufpr.byteassist_backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(
        @RequestParam(required = false) List<String> expand
    ) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userService.getUser(user.getUsername(), expand);
    }

    @GetMapping("{username:[a-z0-9._]{3,30}}")
    @PreAuthorize("hasRole('ADMIN') or #username == authentication.principal.username")
    public ResponseEntity<User> getUser(
            @PathVariable String username,
            @RequestParam(required = false) List<String> expand) {
        return userService.getUser(username, expand);
    }

    @GetMapping()
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers(
            @RequestParam(required = false) List<String> expand) {
        return userService.getAllUsers(expand);
    }

    @PostMapping("/{username:[a-z0-9._]{3,30}}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> createUser(
        @Validated(ValidationGroups.Create.class) @RequestBody User user,
        @PathVariable String username,
        @RequestParam(required = false) List<String> expand) {
        return userService.createUser(user, username, expand);
    }

    @PutMapping("/{username:[a-z0-9._]{3,30}}")
    @PreAuthorize("hasRole('ADMIN') or #username == authentication.principal.username")
    public ResponseEntity<User> updateUser(
            @Validated(ValidationGroups.Update.class) @RequestBody User user,
            @PathVariable String username,
            @RequestParam(required = false) List<String> expand) {
        return userService.updateUser(user, username, expand);
    }

    @DeleteMapping("/{username:[a-z0-9._]{3,30}}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable String username) {
        return userService.deleteUser(username);
    }
    
    @GetMapping("/getAllEmployees")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public List<String> getAllEmployees() {
        return userService.getAllEmployees();
    }
    

}