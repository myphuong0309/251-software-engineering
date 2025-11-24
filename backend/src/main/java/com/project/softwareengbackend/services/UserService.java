package com.project.softwareengbackend.services;

import com.project.softwareengbackend.model.User;
import com.project.softwareengbackend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public Optional<User> getUserById(String userId) {
        return userRepository.findById(userId);
    }

    public Optional<User> updateUser(String userId, User updatedUser) {
        return userRepository.findById(userId)
                .map(user -> {
                    user.setFullName(updatedUser.getFullName());
                    user.setEmail(updatedUser.getEmail());
                    user.setPhoneNumber(updatedUser.getPhoneNumber());
                    return userRepository.save(user);
                });
    }

    public Optional<User> setUserActive(String userId, boolean isActive) {
        return userRepository.findById(userId)
                .map(user -> {
                    user.setActive(isActive);
                    return userRepository.save(user);
                });
    }
}
