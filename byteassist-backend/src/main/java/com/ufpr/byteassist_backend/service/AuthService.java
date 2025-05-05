package com.ufpr.byteassist_backend.service;

import com.surrealdb.RecordId;
import com.ufpr.byteassist_backend.dto.RegistrationRequestDTO;
import com.ufpr.byteassist_backend.dto.UserDTO;
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

    public ResponseEntity<Object> login(String username, String password) {
        User user = userRepo.getUserByUsername(username);
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            String token = jwtService.generateToken(user.getId().toString(), user.getId().toString());
            UserDTO userDTO = new UserDTO(
                    user.getId().toString(),
                    user.getUsername(),
                    user.isActive(),
                    user.getTime().getLastLoginAt(),
                    token);
            // Update last login time
            updateTimeRepo.updateTimeLastLogin(user.getId().toString());
            return new ResponseEntity<>(userDTO, HttpStatus.OK);
        }
        ErrorResponse errorResponse = ErrorResponse.builder()
                .message("Not authenticated")
                .errorCode(HttpStatus.UNAUTHORIZED)
                .statusCode(HttpStatus.UNAUTHORIZED.value())
                .errorDescription("The provided username or password is incorrect.")
                .build();
        return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
    }

    public ResponseEntity<Object> register(RegistrationRequestDTO user, BindingResult bindingResult) {
        Map<String, String> errors = new HashMap<>();

        // First, process any Jakarta validation errors from the annotations in the DTO
        if (bindingResult.hasErrors()) {
            for (FieldError error : bindingResult.getFieldErrors()) {
                errors.put(error.getField(), error.getDefaultMessage());
            }
        }

        // Then, check business rules (username and email availability)
        if (!userRepo.isUsernameAvailable(user.getUsername())) {
            errors.put("username availability", "Username is already taken");
        }

        if (!userRepo.isEmailAvailable(user.getEmail())) {
            errors.put("email availability", "Email is already in use");
        }

        // Validate and convert date format
        ZonedDateTime dobZoned = null;
        try {
            LocalDate localDate = LocalDate.parse(user.getDob());
            dobZoned = localDate.atStartOfDay(ZoneId.systemDefault());
        } catch (DateTimeParseException e) {
            errors.put("dob", "Invalid date format. Please use YYYY-MM-DD");
        }

        // If there are any errors (either validation or business rules), return them
        if (!errors.isEmpty()) {
            ErrorResponse errorResponse = ErrorResponse.builder()
                    .message("Validation Error")
                    .errorCode(HttpStatus.BAD_REQUEST)
                    .statusCode(HttpStatus.BAD_REQUEST.value())
                    .errorDescription("The provided registration data is invalid")
                    .build();

            // Set all validation errors
            errorResponse.setValidationErrors(errors);

            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        // If no errors, proceed with registration
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        PersonName name = new PersonName(user.getFirstName(), user.getLastName());
        PersonAddress address = new PersonAddress(user.getZip(), user.getNumber(), user.getStreet(), user.getCity(),
                user.getState(), user.getCountry(), user.getNeighborhood());
        Person person = new Person(
                null,
                user.getCpf(),
                dobZoned, // Using the converted ZonedDateTime
                user.getGender(),
                address,
                name);

        // Call createPerson method for debugging
        RecordId createdPerson = personRepo.createPerson(person, user.getUsername()).getId();

        User newUser = new User(
                null,
                user.getEmail(),
                true,
                user.getPassword(),
                createdPerson,
                null,
                "Client",
                user.getUsername());

        userRepo.createUser(newUser);

        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    public ResponseEntity<Object> validateUsername(String username) {
        boolean isAvailable = userRepo.isUsernameAvailable(username);
        return new ResponseEntity<>(isAvailable ? HttpStatus.OK : HttpStatus.CONFLICT);
    }

    public ResponseEntity<Object> validateEmail(String email) {
        boolean isAvailable = userRepo.isEmailAvailable(email);
        return new ResponseEntity<>(isAvailable ? HttpStatus.OK : HttpStatus.CONFLICT);
    }
}