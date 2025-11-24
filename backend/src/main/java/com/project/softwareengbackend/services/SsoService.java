package com.project.softwareengbackend.services;

public interface SsoService {
    String authenticate(String email, String password);
    boolean validateToken(String token);
}
