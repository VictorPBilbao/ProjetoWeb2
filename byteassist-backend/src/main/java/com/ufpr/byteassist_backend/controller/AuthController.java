package com.ufpr.byteassist_backend.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @GetMapping("/health")
    public String returnControllerStatus() {
        return "OK";
    }

    @PostMapping("/login")
    public String getMethodName(@RequestParam String username, @RequestParam String password) {
        return "Received username: " + username + " and password: " + password;
    }

}
