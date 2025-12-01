package com.project.softwareengbackend.services;

import com.project.softwareengbackend.dto.LoginRequest;
import com.project.softwareengbackend.dto.LoginResponse;
import com.project.softwareengbackend.model.User;
import com.project.softwareengbackend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final SsoService ssoService;

    public User register(User user) {
        return userRepository.save(user);
    }

    public LoginResponse login(LoginRequest loginRequest) {
        String token = ssoService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());
        if (token != null) {
            return LoginResponse.builder().token(token).build();
        }
        return null;
    }
}
