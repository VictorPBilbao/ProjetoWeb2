package com.ufpr.byteassist_backend.service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;

import io.github.cdimascio.dotenv.Dotenv;

@Service
public class JwtService {
    private static final Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
    private static final String SECRET_KEY = dotenv.get("JWT_SECRET");
    private static final Algorithm ALGORITHM = Algorithm.HMAC256(SECRET_KEY);

    public String generateToken(String userId, String username, String role) {
        LocalDateTime now = LocalDateTime.now();
        Date issuedAt = Date.from(now.atZone(ZoneId.systemDefault()).toInstant());
        Date expiresAt = Date.from(now.plusDays(1).atZone(ZoneId.systemDefault()).toInstant());

        return JWT.create()
                .withSubject(userId)
                .withClaim("username", username.replaceAll("[⟨⟩]", ""))
                .withClaim("role", role)
                .withIssuedAt(issuedAt)
                .withExpiresAt(expiresAt)
                .sign(ALGORITHM);
    }

    public String validateToken(String token) {
        try {
            return JWT.require(ALGORITHM)
                    .build()
                    .verify(token)
                    .getClaim("username")
                    .asString();
        } catch (Exception e) {
            return null;
        }
    }
}