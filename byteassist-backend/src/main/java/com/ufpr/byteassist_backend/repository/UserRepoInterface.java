package com.ufpr.byteassist_backend.repository;

import java.util.Iterator;
import java.util.Optional;

import com.ufpr.byteassist_backend.model.User;

public interface UserRepoInterface {
    Optional<User> getUser(String username);
    Optional<User> createUser(User user, String username);
    Optional<User> updateUser(User user, String username);
    Boolean deleteUser(String username);
    Optional<Iterator<User>> getAllUsers();
}
