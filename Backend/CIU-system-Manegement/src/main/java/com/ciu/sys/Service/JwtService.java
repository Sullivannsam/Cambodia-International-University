package com.ciu.sys.Service;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

  private final SecretKey key;
  private final long expirationMs;

  public JwtService(
      @Value("${app.jwt.secret}") String secret,
      @Value("${app.jwt.expiration}") long expirationMs) {
    this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    this.expirationMs = expirationMs;
  }

  public String generateToken(String email, String role) {
    return Jwts.builder()
        .subject(email)
        .claim("role", role)
        .issuedAt(new Date())
        .expiration(new Date(System.currentTimeMillis() + expirationMs))
        .signWith(key)
        .compact();
  }

  public String extractEmail(String token) {
    return claims(token).getSubject();
  }

  public String extractRole(String token) {
    Object role = claims(token).get("role");
    return role == null ? null : role.toString();

  }

  public boolean isValid(String token) {
    try {
      claims(token);
      return true;
    } catch (Exception e) {
      return false;
    }
  }

  public Claims claims(String token) {
    return Jwts.parser().verifyWith(key).build()
        .parseSignedClaims(token).getPayload();

  }
}
