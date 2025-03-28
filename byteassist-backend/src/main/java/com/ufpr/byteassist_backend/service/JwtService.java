package com.ufpr.byteassist_backend.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JwtService {
    private static final String SECRET_KEY = "test-secret-key";
    private static final long EXPIRATION_TIME = 86400000; // 1 day in milliseconds

    public String generateToken(String userId, String username) {
        return JWT.create()
                .withSubject(userId)
                .withClaim("username", username)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .sign(Algorithm.HMAC256(SECRET_KEY));
    }
}
