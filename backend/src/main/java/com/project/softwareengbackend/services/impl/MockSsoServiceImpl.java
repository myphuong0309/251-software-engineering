package com.project.softwareengbackend.services.impl;

import com.project.softwareengbackend.model.User;
import com.project.softwareengbackend.repositories.UserRepository;
import com.project.softwareengbackend.services.SsoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MockSsoServiceImpl implements SsoService {

    private final UserRepository userRepository;

    @Override
    public String authenticate(String email, String password) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            // In a real scenario, you would check the password hash.
            // For this mock, we assume the password is not stored and any password is valid.
            String token = UUID.randomUUID().toString();
            User user = userOptional.get();
            user.setSsoToken(token);
            userRepository.save(user);
            return token;
        }
        return null;
    }

    @Override
    public boolean validateToken(String token) {
        return token != null;
    }
}
