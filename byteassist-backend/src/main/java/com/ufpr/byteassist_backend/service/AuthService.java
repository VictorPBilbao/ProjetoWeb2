package com.ufpr.byteassist_backend.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.ufpr.byteassist_backend.dto.DetailedUserDTO;
import com.ufpr.byteassist_backend.dto.UserDTO;
import com.ufpr.byteassist_backend.exception.EnhancedStatusException;
import com.ufpr.byteassist_backend.model.User;
import com.ufpr.byteassist_backend.repository.PersonRepo;
import com.ufpr.byteassist_backend.repository.UpdateTimeRepo;
import com.ufpr.byteassist_backend.repository.UserRepo;

@Service
public class AuthService implements UserDetailsService {
    // Repositório de usuários para operações relacionadas ao User
    private final UserRepo userRepo;
    // Repositório para atualizar o campo de último login
    private final UpdateTimeRepo updateTimeRepo;
    // Serviço responsável pela geração de tokens JWT
    private final JwtService jwtService;
    // Encoder para criptografar e verificar senhas
    private final BCryptPasswordEncoder passwordEncoder;
    // Repositório de pessoas para operações relacionadas à entidade Person
    private final PersonRepo personRepo;
    // Gerenciador de autenticação para validar credenciais
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepo userRepo, UpdateTimeRepo updateTimeRepo, JwtService jwtService, PersonRepo personRepo, @Lazy AuthenticationManager authenticationManager) {
        this.userRepo = userRepo;
        this.updateTimeRepo = updateTimeRepo;
        this.jwtService = jwtService;
        this.passwordEncoder = new BCryptPasswordEncoder();
        this.personRepo = personRepo;
        this.authenticationManager = authenticationManager;
    }


    public ResponseEntity<UserDTO> login(String username, String password) {

        try {
            // Autentica o usuário
            authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(username, password)
            );

            // Busca o usuário autenticado
            User user = userRepo.getUser(username)
            .orElseThrow(() -> new EnhancedStatusException(
                HttpStatus.UNAUTHORIZED,
                "User not found",
                "The provided username does not exist."
            ));

            // Gera o token JWT
            String token = jwtService.generateToken(
            user.getId().toString(),
            user.getId().getId().toString(),
            user.getRole()
            );

            // Atualiza o campo de último login
            updateTimeRepo.updateTimeLastLogin(user.getId().toString());

            // Cria e retorna o DTO de resposta
            UserDTO userDTO = new UserDTO(
            user.getId().toString(),
            user.isActive(),
            user.getTime().getLastLoginAt(),
            token
            );
            return ResponseEntity.ok(userDTO);

        } catch (org.springframework.security.core.AuthenticationException ex) {
            throw new EnhancedStatusException(
            HttpStatus.UNAUTHORIZED,
            "Authentication failed",
            "The provided username or password is incorrect."
            );
        }
    }

    public ResponseEntity<UserDTO> register(DetailedUserDTO user, String username) {
        // Checa disponibilidade de username e email antes de qualquer operação
        if (!userRepo.isUsernameAvailable(username)) {
            throw new EnhancedStatusException(
                HttpStatus.CONFLICT,
                "Username already exists",
                "The provided username is already taken."
            );
        }
        if (!userRepo.isEmailAvailable(user.getEmail())) {
            throw new EnhancedStatusException(
                HttpStatus.CONFLICT,
                "Email already exists",
                "The provided email is already in use."
            );
        }

        // Criptografa a senha antes de persistir
        String hashedPassword = passwordEncoder.encode(user.getPassword());

        // Cria e persiste o usuário e a pessoa associada
        User newUser = new User();
        newUser.setEmail(user.getEmail());
        newUser.setPassword(hashedPassword);

        // Cria a pessoa associada e o usuário em sequência
        personRepo.createPerson(user.getPerson(), username);
        Optional<User> createdUser = userRepo.createUser(newUser, username);

        // Retorna resposta apropriada
        return createdUser.map(u -> {
            String token = jwtService.generateToken(
                u.getId().toString(),
                u.getId().getId().toString(),
                u.getRole()
            );
            UserDTO userDTO = new UserDTO(
                u.getId().toString(),
                u.isActive(),
                u.getTime().getLastLoginAt(),
                token
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(userDTO);
        }).orElseThrow(() -> new EnhancedStatusException(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "User creation failed",
            "Unable to create a new user."
        ));
    }

    public ResponseEntity<HttpStatus> validateUsername(String username) {
        return new ResponseEntity<>(userRepo.isUsernameAvailable(username) ? HttpStatus.OK : HttpStatus.CONFLICT);
    }

    public ResponseEntity<HttpStatus> validateEmail(String email) {
        return new ResponseEntity<>(userRepo.isEmailAvailable(email) ? HttpStatus.OK : HttpStatus.CONFLICT);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepo.getUser(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
    }
}