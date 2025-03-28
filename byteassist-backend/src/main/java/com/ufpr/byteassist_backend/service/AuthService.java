package com.ufpr.byteassist_backend.service;

import com.ufpr.byteassist_backend.dto.UserDTO;
import com.ufpr.byteassist_backend.model.User;
import com.ufpr.byteassist_backend.repository.UserRepo;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepo userRepo;

    public AuthService(DatabaseService databaseService) {
        this.userRepo = new UserRepo(databaseService);
    }

    public UserDTO login(String username, String password) {
        // ! REGRA DE NEGÓCIO: O usuário deve existir e a senha deve ser a mesma da
        // ! cadastrada Se o critério for atendido, retorna o usuário e o ID, não deve
        // ! retornar a senha
        User user = userRepo.getUserByUsername(username);
        if (user != null && user.password.equals(password)) {
            return new UserDTO(user.id.toString(), user.username);
        }
        throw new RuntimeException("Invalid username or password");
    }
}