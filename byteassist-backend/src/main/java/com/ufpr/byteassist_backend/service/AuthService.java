package com.ufpr.byteassist_backend.service;

import com.ufpr.byteassist_backend.dto.DetailedUserDTO;
import com.ufpr.byteassist_backend.dto.RegistrationRequestDTO;
import com.ufpr.byteassist_backend.dto.UserDTO;
import com.ufpr.byteassist_backend.exception.EnhancedStatusException;
import com.ufpr.byteassist_backend.model.User;
import com.ufpr.byteassist_backend.repository.PersonRepo;
import com.ufpr.byteassist_backend.repository.UpdateTimeRepo;
import com.ufpr.byteassist_backend.repository.UserRepo;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Serviço responsável pela autenticação e registro de usuários.
 * Contém métodos para login, registro, validação de username e email.
 */
@Service
public class AuthService {
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

    /**
     * Construtor com injeção de dependências.
     * @param userRepo Repositório de usuários
     * @param updateTimeRepo Repositório para atualização de tempo de login
     * @param jwtService Serviço de geração de JWT
     * @param personRepo Repositório de pessoas
     */
    public AuthService(UserRepo userRepo, UpdateTimeRepo updateTimeRepo, JwtService jwtService, PersonRepo personRepo) {
        this.userRepo = userRepo;
        this.updateTimeRepo = updateTimeRepo;
        this.jwtService = jwtService;
        this.passwordEncoder = new BCryptPasswordEncoder();
        this.personRepo = personRepo;
    }

    /**
     * Realiza o login do usuário.
     * @param username Nome de usuário informado
     * @param password Senha informada
     * @return ResponseEntity contendo o DTO do usuário autenticado e o token JWT
     * @throws EnhancedStatusException caso o usuário não exista ou a senha esteja incorreta
     */
    public ResponseEntity<UserDTO> login(String username, String password) {
        // Busca o usuário pelo username
        Optional<User> user = userRepo.getUser(username);
        // Verifica se o usuário existe e se a senha está correta
        if (user.isEmpty() || !passwordEncoder.matches(password, user.get().getPassword())) {
            throw new EnhancedStatusException(
                HttpStatus.UNAUTHORIZED,
                "Authentication failed",
                "The provided username or password is incorrect."
            );
        }
        // Gera o token JWT para o usuário autenticado
        String token = jwtService.generateToken(user.get().getId().toString(), user.get().getId().toString());
        // Cria o DTO de resposta com informações do usuário e token
        UserDTO userDTO = new UserDTO(
            user.get().getId().toString(),
            user.get().isActive(),
            user.get().getTime().getLastLoginAt(),
            token);
        // Atualiza o campo de último login do usuário
        updateTimeRepo.updateTimeLastLogin(user.get().getId().toString());
        // Retorna a resposta com status 200 OK
        return new ResponseEntity<>(userDTO, HttpStatus.OK);
    }

    /**
     * Realiza o registro de um novo usuário.
     * @param user DTO detalhado do usuário a ser registrado
     * @param username Nome de usuário desejado
     * @return ResponseEntity contendo o DTO do usuário criado e o token JWT
     * @throws EnhancedStatusException caso o username ou email já estejam em uso, ou ocorra erro na criação
     */
    public ResponseEntity<UserDTO> register(DetailedUserDTO user, String username) {

        // Verifica se o username já está em uso
        if (!userRepo.isUsernameAvailable(username)) {
            throw new EnhancedStatusException(
                HttpStatus.CONFLICT,
                "Username already exists",
                "The provided username is already taken."
            );
        }

        // Verifica se o email já está em uso
        if (!userRepo.isEmailAvailable(user.getEmail())) {
            throw new EnhancedStatusException(
                HttpStatus.CONFLICT,
                "Email already exists",
                "The provided email is already in use."
            );
        }
        
        // Cria o registro da pessoa associada ao usuário
        personRepo.createPerson(user.getPerson(), username);
        
        // Criptografa a senha usando BCrypt
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);
        
        // Cria o objeto User para persistência
        User newUser = new User();
        newUser.setEmail(user.getEmail());
        newUser.setPassword(hashedPassword);
        Optional<User> createdUser = userRepo.createUser(newUser, username);
        
        // Gera o token JWT e retorna o DTO do usuário criado
        if (createdUser.isPresent()) {
            String token = jwtService.generateToken(createdUser.get().getId().toString(), createdUser.get().getId().toString());
            UserDTO userDTO = new UserDTO(
                createdUser.get().getId().toString(),
                createdUser.get().isActive(),
                createdUser.get().getTime().getLastLoginAt(),
                token
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(userDTO);
        } else {
            // Caso ocorra erro na criação do usuário, lança exceção
            throw new EnhancedStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "User creation failed",
                "Unable to create a new user."
            );
        }
    }

    /**
     * Valida se o username está disponível.
     * @param username Nome de usuário a ser validado
     * @return ResponseEntity com status OK se disponível, CONFLICT se já estiver em uso
     */
    public ResponseEntity<HttpStatus> validateUsername(String username) {
        return new ResponseEntity<>(userRepo.isUsernameAvailable(username) ? HttpStatus.OK : HttpStatus.CONFLICT);
    }

    /**
     * Valida se o email está disponível.
     * @param email Email a ser validado
     * @return ResponseEntity com status OK se disponível, CONFLICT se já estiver em uso
     */
    public ResponseEntity<HttpStatus> validateEmail(String email) {
        return new ResponseEntity<>(userRepo.isEmailAvailable(email) ? HttpStatus.OK : HttpStatus.CONFLICT);
    }
}