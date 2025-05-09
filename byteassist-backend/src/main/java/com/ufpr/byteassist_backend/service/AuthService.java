package com.ufpr.byteassist_backend.service;

import com.surrealdb.RecordId;
import com.ufpr.byteassist_backend.dto.RegistrationRequestDTO;
import com.ufpr.byteassist_backend.dto.UserDTO;
import com.ufpr.byteassist_backend.exception.EnhancedStatusException;
import com.ufpr.byteassist_backend.exception.ErrorResponse;
import com.ufpr.byteassist_backend.model.Person;
import com.ufpr.byteassist_backend.model.PersonAddress;
import com.ufpr.byteassist_backend.model.PersonName;
import com.ufpr.byteassist_backend.model.User;
import com.ufpr.byteassist_backend.repository.PersonRepo;
import com.ufpr.byteassist_backend.repository.UpdateTimeRepo;
import com.ufpr.byteassist_backend.repository.UserRepo;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {
    private final UserRepo userRepo;
    private final UpdateTimeRepo updateTimeRepo;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder passwordEncoder;
    private final PersonRepo personRepo;

    // Constructor injection
    public AuthService(UserRepo userRepo, UpdateTimeRepo updateTimeRepo, JwtService jwtService, PersonRepo personRepo) {
        this.userRepo = userRepo;
        this.updateTimeRepo = updateTimeRepo;
        this.jwtService = jwtService;
        this.passwordEncoder = new BCryptPasswordEncoder();
        this.personRepo = personRepo;
    }

    public ResponseEntity<UserDTO> login(String username, String password) {
        Optional<User> user = userRepo.getUser(username);
        if (user.isEmpty() || !passwordEncoder.matches(password, user.get().getPassword())) {
            throw new EnhancedStatusException(
                HttpStatus.UNAUTHORIZED,
                "Authentication failed",
                "The provided username or password is incorrect."
            );
        }
        String token = jwtService.generateToken(user.get().getId().toString(), user.get().getId().toString());
        UserDTO userDTO = new UserDTO(
            user.get().getId().toString(),
            user.get().isActive(),
            user.get().getTime().getLastLoginAt(),
            token);
        // Update last login time
        updateTimeRepo.updateTimeLastLogin(user.get().getId().toString());
        return new ResponseEntity<>(userDTO, HttpStatus.OK);
    }

    public ResponseEntity<UserDTO> register(RegistrationRequestDTO user, String username) {

        if (!userRepo.isUsernameAvailable(username)) {
            throw new EnhancedStatusException(
                HttpStatus.CONFLICT,
                "Username already exists",
                "The provided username is already taken."
            );
        }

        if (!userRepo.isEmailAvailable(user.getUser().getEmail())) {
            throw new EnhancedStatusException(
                HttpStatus.CONFLICT,
                "Email already exists",
                "The provided email is already in use."
            );
        }
        
        // Create Person object
        Optional<Person> person = personRepo.createPerson(user.getPerson(), username);
        
        System.out.println("Person created: " + person);
        
        // Create User object
        Optional<User> newUser = userRepo.createUser(user.getUser(), username);
        
        System.out.println("User created: " + newUser);
        
        // Generate JWT token
        if (newUser.isPresent()) {
            String token = jwtService.generateToken(newUser.get().getId().toString(), newUser.get().getId().toString());
            UserDTO userDTO = new UserDTO(
                newUser.get().getId().toString(),
                newUser.get().isActive(),
                newUser.get().getTime().getLastLoginAt(),
                token
            );
            return new ResponseEntity<>(userDTO, HttpStatus.CREATED);
        } else {
            throw new EnhancedStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "User creation failed",
                "Unable to create a new user."
            );
        }
    }

    public ResponseEntity<HttpStatus> validateUsername(String username) {
        return new ResponseEntity<>(userRepo.isUsernameAvailable(username) ? HttpStatus.OK : HttpStatus.CONFLICT);
    }

    public ResponseEntity<HttpStatus> validateEmail(String email) {
        return new ResponseEntity<>(userRepo.isEmailAvailable(email) ? HttpStatus.OK : HttpStatus.CONFLICT);
    }
}